const axios = require('axios')

const parseEquipment = (items, weaponProficiencies, armorProficiencies) => {
    const equipment = {
        equipped_armor: [],
        attacks: {
            advantage: 0,
            weapons: [],
            magic_weapons: []
        },
        inventory: [],
        treasure: {
            cp: 0,
            sp: 0,
            ep: 0,
            gp: 0,
            pp: 0,
            other: []
        }
    }

    for(let item of items.set) {
        console.log(item);
        if(item.equipment && item.equipment.unit) {
            item={
                ...item.equipment
            };
        }
        else if (
               item.equipment && item.equipment.desc && item.equipment.desc.contents
             ) {
               for (let thing of item.equipment.desc.contents) {
                 let costAmt = thing.item.desc.cost.match(/\d+/g);
                 let denom = thing.item.desc.cost.match(/[a-zA-Z]+/g);
                 equipment.inventory.push({
                   ...thing.item.desc,
                   cost: { amount: costAmt, denomination: denom },
                   name: thing.item.name,
                   quantity: thing.quantity,
                 });
               }
               continue;
             } else if (
               !(item.desc || (item.equipment && item.equipment.desc))
             ) {
               item.equipment
                 ? equipment.inventory.push({
                     ...item.equipment,
                     quantity: item.quantity,
                   })
                 : equipment.inventory.push(item);
               continue;
             } else if (item.equipment) {
               let costAmt = item.equipment.desc
                 ? item.equipment.desc.cost.match(/\d+/g)
                 : 0;
               let denom = item.equipment.desc
                 ? item.equipment.desc.cost.match(/[a-zA-Z]+/g)
                 : '';
               item = {
                 ...item.equipment.desc,
                 cost: {
                   amount: costAmt,
                   denomination: denom,
                 },
                 name: item.equipment.name,
                 quantity: item.quantity ? 1 : item.quantity,
               };
             } else {
               let costAmt = item.desc ? item.desc.cost.match(/\d+/g) : 0;
               let denom = item.desc ? item.desc.cost.match(/[a-zA-Z]+/g) : '';

               item = {
                 ...item.desc,
                 cost: {
                   amount: costAmt,
                   denomination: denom,
                 },
                 name: item.name,
                 quantity: item.quantity ? 1 : item.quantity,
               };
             }
       
        sortEquipment(equipment, item, weaponProficiencies, armorProficiencies);
    }

    for(let key in items.choices) {
        let item = items.choices[key];
        console.log("ITEM", item);
        if(!(item.desc || (item.equipment && item.equipment.desc))) {
            equipment.inventory.push(item);
            continue;
        }
        else if (item.equipment.desc && item.equipment.desc.contents) {
            for(let thing of item.equipment.desc.contents) {
                let costAmt = thing.item.desc.cost.match(/\d+/g);
                let denom = thing.item.desc.cost.match(/[a-zA-Z]+/g);
                equipment.inventory.push(
                    {...thing.item.desc, 
                    cost: {amount: costAmt, denomination: denom},
                    name: thing.item.name,
                    quantity: thing.quantity})
            }
            continue;
        }
        if(Array.isArray(item.equipment)) {
            for(let choice of item.equipment) {
                if(choice.index != undefined) {
                    let costAmt = choice.desc.cost.match(/\d+/g)
                    let denom =  choice.desc.cost.match(/[a-zA-Z]+/g);
        
                    choice = {
                        ...choice.desc,
                        name: choice.name,
                        cost: {
                            amount: costAmt,
                            denomination: denom
        
                        },        
                        quantity: !choice.quantity ? 1 : choice.quantity
                    };
                    sortEquipment(equipment, choice, weaponProficiencies, armorProficiencies);
                }
            }
        }
        else if(item.equipment.choose) {
            //do nothing
        }
        else {
            let costAmt = item.equipment.desc.cost.match(/\d+/g)
            let denom =  item.equipment.desc.cost.match(/[a-zA-Z]+/g);

            item = {
                ...item.equipment.desc,
                name: item.equipment.name,
                cost: {
                    amount: costAmt,
                    denomination: denom
                },  
                quantity: !item.equipment.quantity ? 1 : item.equipment.quantity
            }
            sortEquipment(equipment, item, weaponProficiencies, armorProficiencies);
        }
        if (item.selection != undefined) {
            for(let choice of Object.keys(item.selection)) {
                choice = item.selection[choice];
                for(let item of choice) {
                    let costAmt = item.desc.cost.match(/\d+/g)
                    let denom =  item.desc.cost.match(/[a-zA-Z]+/g);

                    item = {
                        ...item.desc, 
                        name: item.name,
                        cost: {
                            amount: costAmt,
                            denomination: denom
        
                        },        
                        quantity: !item.quantity ? 1 : item.quantity
                    };
                    sortEquipment(equipment, item, weaponProficiencies, armorProficiencies)
                }
            }
        }
    }
    return equipment;
}

const fillModel = async (equipment, character) => { //will probably need a separate way to update an existing model
    const userSelections = {
        feature: [],
        skill: [],
        trait: [],
        language: [],
        tool: [],
        armor: [],
        weapon: [],
        throw: [],
        expertise: []
    }
    //console.log(character.class.choices, character.race.choices, character.background.choices);
    sortChoices(userSelections, character.class.choices);
    sortChoices(userSelections, character.race.choices);
    character.background.choices && sortChoices(userSelections, character.background.choices);
    const level = character.level === undefined ? 1 : character.level;
    const proficiency_bonus = 1 + Math.ceil(level/4)
    //console.log(userSelections);
    const ability_relevant = abilityScoreParser(character.abilities, userSelections, proficiency_bonus, character.race.proficiencies, character.class.proficiencies);
    let health = character.class.hit_die + ability_relevant.ability_scores.con.modifier;//only works for 1st level
    if(character.subrace == 'Hill Dwarf') health+= level;
    let subclassFeatures = character.subclass ? character.subclass.subclass_features : [];
    let subraceTraits = character.subrace ? character.subrace.racial_traits : [];
    let levelDetails;
    await levelSorter(character.class.index, level).then((level) => {
        levelDetails = level;
    });

        const model = {
            charID: character.charID, 
            name: character.name,
            level: level, 
            experience: {
                current: 0,
                threshold: expPerLevel[level]
            },
            race: {
                name: character.race.index,
                subrace: character.race.sub ? character.race.sub.name : null
            },
            class: [{ //Will need to do a loop to fill any other classes
                name: character.class.index,
                levels: character.class.level,
                subclass: character.class.subclass ? character.class.subclass.name : null
            }],
            features: character.class.features.concat(userSelections.feature).concat(subclassFeatures).concat([character.background.feature]), 
            traits: character.race.traits.concat(userSelections.trait).concat(subraceTraits), 
            background: {
                name: character.background.name,
                description: Array.isArray(character.background.desc) ? character.background.desc.join('\n') : character.background.desc
            },
            class_specific: levelDetails.class_specific,
            proficiency_bonus: proficiency_bonus,
            misc_proficiencies: {
                armor: [...character.class.proficiencies.Armor||[], ...character.race.proficiencies.Armor||[], ...character.background.proficiencies.Armor||[], ...userSelections.armor||[]],
                weapons: [...character.class.proficiencies.Weapons||[], ...character.race.proficiencies.Weapons||[], ...character.background.proficiencies.Weapons||[], ...userSelections.weapon||[]],
                tools: [...character.class.proficiencies.Tools||[], ...character.race.proficiencies.Tools||[], ...character.background.proficiencies.Tools||{}, ...userSelections.tool||[]],
                languages: [...character.class.proficiencies.Languages||[], ...character.race.proficiencies.Languages||[], ...character.background.proficiencies.Languages||[], ...userSelections.language||[]]
            },
            ability_scores: ability_relevant.ability_scores,
            saving_throws: ability_relevant.saving_throws,
            skills: ability_relevant.skills,
            ac: acCalculator(equipment.equipped_armor, character.class.index, ability_relevant.ability_scores), 
            health: {//not expandable for multiple subraces...it's checking for hill dwarf lazily
                current: health,
                max: health, 
                temp: 0
            }, 
            hit_dice: [ //for multiclassing will need to populate further
                {
                    current: level,
                    max: level,
                    type: character.class.hit_die
                }
            ], 
            initiative_bonus: ability_relevant.ability_scores.dex.modifier, 
            ...equipment, 
            spells: character.spells ? {
                slots: levelDetails.slots,
                casting_ability: character.class.spellcasting.spellcasting_ability.index,
                advantage: 0,
                cards: spellsPopulator(character.spells)
            } : null,
            defenses: {
                advantage: 0, // if advantage is -1, 0, or 1
                resistances: [],
                immunities: [],
                vulnerabilities: []
            },
            conditions: [],
            death_throws: {
                successes: 0,
                failures: 0
            },
            walking_speed: character.race.speed,
            size: character.race.size,
            lore: character.description.lore,
            physical_description: character.description.physical_description,
            portrait: character.description.portrait,
        }
        //console.log(model);
        return model;
}

const sortEquipment = (equipment, item, weaponProficiencies, armorProficiencies) => {
    //console.log(item);
    let category = item.category ? item.category.toLowerCase() : 'pack';
    if(category.includes("weapon")) {
        item.pinned = false;
        //console.log(weaponProficiencies, item)
        if(weaponProficiencies.find(weapon => weapon.toLowerCase().includes(item.name.substring(0, item.name.indexOf(' ')).toLowerCase()))) item.proficiency = true;
        else item.proficiency = false;
        item.properties = item.desc.split(', ');
        delete item.desc;

        //if(category.includes("magic")) equipment.attacks.magic_weapons.push(item);
        /*else*/ equipment.attacks.weapons.push(item);
    }
    else if (category.includes("armor")) {
        item.pinned = false;
        item.equipped = false;
        item.armor_class= {
            base: item.base,
            dex_bonus: item.dex_bonus,
            max_bonus: item.max_bonus
        }
        if(armorProficiencies.find(armor=> armor.toLowerCase().includes(item.category.toLowerCase()))) item.proficiency = true;
        else if(armorProficiencies.includes('All armor') && !item.category.toLowerCase().includes('shield')) item.proficiency=true;
        else if(armorProficiencies.includes('Shields') && item.category.toLowerCase().includes('shield')) item.proficiency = true;
        else if(armorProficiencies.find(armor => armor.toLowerCase() === item.name.toLowerCase())) item.proficiency = true;
        else item.proficiency = false;

        delete item.dex_bonus;
        delete item.max_bonus;
        delete item.base;
        equipment.equipped_armor.push(item);
    }
    else if (category.includes("currency")) {
       
        equipment.treasure[item.unit] += item.quantity;
    }
    else if (category.includes("treasure")) {
        item.pinned = false;
        equipment.treasure.other.push(item);
    }
    else {
        item.pinned = false;
        equipment.inventory.push(item);
    }
}

const sortChoices = (choices, parent) => {

    for(let key1 in parent) {
        if(key1.includes("ability")) continue;
        let category;
        for(let key2 in choices) {
            if(key1.includes(key2)) {
                category = key2;
                break;
            }
        }
        let choice = parent[key1];
        //console.log(choice);
        for(let item of choice) {
            if(item && typeof item=== 'object' && !(category.includes('feature') || category.includes('trait'))) {
                //console.log(item.name);
                item = item.name;
            }
            choices[category].push(item);
        }
    }
}

const abilityScoreParser = (abilities, selections, proficiency, race, theclass) => {
    const scores = {
        ability_scores: {},
        saving_throws: {},
        skills: {
            acrobatics: {},
              animal_handling: {},
              arcana: {},
              athletics: {},
              deception: {},
              history: {},
              insight: {},
              intimidation: {},
              investigation: {},
              medicine: {},
              nature: {},
              perception: {},
              performance: {},
              persuasion: {},
              religion: {},
              sleight_of_hand: {},
              stealth: {},
              survival: {},
        }
    }
    for(let ability in abilities) {
        ability = abilities[ability];
        scores.ability_scores[ability.short_name] = {
            score: ability.finalScore,
            modifier: ability.modifier,
            advantage: 0
        }
        let raceProfs = race.Skills ? race.Skills : [];
        let classProfs = theclass.Skills ? theclass.Skills : [];
        const allSkillProfs = selections.skill.concat(raceProfs).concat(classProfs);
        for(let skill of skillScores[ability.short_name]) {
            //console.log(skill);
            let proficiencyExists = allSkillProfs.find(aSkill => aSkill.toLowerCase().replaceAll(' ', '_') === skill);
            let expertise = selections.expertise.find(aExp => aExp.toLowerCase().substring(aExp.toLowerCase().indexOf(':')+2).replaceAll(' ', '_') === skill);
            scores.skills[skill] = {
                proficiency: !proficiencyExists ? false : true,
                modifier: !expertise ? ability.modifier + (!proficiencyExists ? 0 : proficiency) : ability.modifier + (proficiency * 2), 
                advantage: 0
            }
        }
        raceProfs = race.Throws ? race.Throws : [];
        classProfs = theclass.Throws ? theclass.Throws : [];
        const allThrowProfs = selections.throw.concat(raceProfs).concat(classProfs);
        let proficiencyExists = allThrowProfs.find(aThrow => aThrow.toLowerCase() === ability.short_name);
        scores.saving_throws[ability.short_name] = {
            proficiency: !proficiencyExists ? false : true,
            modifier: !proficiencyExists ? ability.modifier : ability.modifier + proficiency,
            advantage: 0
        }
    }
    return scores;
}

const acCalculator = (armorList, theClass, abScores) => {
    let best = {
        armor: {},
        maxAC: 10
    }
    let shield = false;
    //unarmored
    if(theClass=='monk') best.maxAC += abScores.wis.modifier;
    else if(theClass=='barbarian') best.maxAC += abScores.con.modifier;
    best.maxAC += abScores.dex.modifier;
    if (theClass=='sorcerer') best.maxAC = 13 + abScores.dex.modifier;

    for(let armor of armorList) {
        if(armor.proficiency && armor.name.toLowerCase().includes('shield')) {
            shield = true;
            armor.equipped = true;
        }
        let maxAC = armor.armor_class.base + (armor.armor_class.dex_bonus ? (armor.armor_class.max_bonus && abScores.dex.modifier >= armor.armor_class.max_bonus ? armor.armor_class.max_bonus : abScores.dex.modifier) : 0);
        if(armor.proficiency && maxAC > best.maxAC) {
            best.maxAC = maxAC;
            best.armor = armor;
        }
    }
    if(best.armor.name) {
        for(let armor of armorList) {
            //console.log(best.armor);
            if(armor.name.toLowerCase()===best.armor.name.toLowerCase()) {
                armor.equipped = true;
            }
        }
    }
    return shield ? best.maxAC : best.maxAC + 2;
}

const levelSorter = async (charClass, charLevel) => {
    //console.log("in levels sorter");
    let connection = `/api/classes/${charClass.toLowerCase()}/levels/${charLevel}`;
    //console.log(connection);
    const thing =  await axios
          .get(connection)
          .then(level => {
            level = level.data;
           // console.log(level);
            let slots = [];
            let class_specific = null;
            if(level.class_specific) {
                class_specific = level.class_specific;
            }
            if(level.spellcasting) {
                slots[0] = {
                    current: level.spellcasting.cantrips_known,
                    max: level.spellcasting.cantrips_known
                };
                for(let i = 1; i <= 9; i++) {
                    let key = `spell_slots_level_${i}`;
                    slots.push({
                        current: level.spellcasting[key],
                        max: level.spellcasting[key]
                    })
                }
            }
            return {slots: slots, class_specific: class_specific};
          })
          .then(level => {
              //console.log(level);
              return level
    })
    return thing;
}

const spellsPopulator = (spells) => {
    const cards = [[],[],[],[],[],[],[], [], []];
    for (let i = 0; i < 9; i++) {
        let key;
        if(spells[i] == undefined) break;
        if(i === 0) key = 'cantrips';
        else key=`level${i}`;
        let list = spells[i];
        for(let spell of list) {
            let found = spells.cards[key].find(card => card.index === spell)
            if(found) {
                found.pinned=false;
                found.prepared = false;
                cards[i].push(found);    
            }
        }
    }
    return cards;
}

/*expPerLevel[level] gives u the points u need to proceed to [level+1] */
const expPerLevel = [0,300,900,2700,6500,14000,23000,34000,48000,64000,85000,100000,120000,140000,165000,195000,225000,265000,305000,355000];
const skillScores = {
    str: ['athletics'],
    dex: ['acrobatics', 'sleight_of_hand', 'stealth'],
    int: ['arcana', 'history', 'investigation', 'nature', 'religion'],
    wis: ['animal_handling', 'insight', 'medicine', 'perception', 'survival'],
    cha: ['deception', 'intimidation', 'performance', 'persuasion'],
    con: []
}


module.exports = { parseEquipment, fillModel }
