const axios = require('axios')

const parseEquipment = (items) => {
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
        item = {
            ...item.desc,
            name: item.name,
            quantity: item.quantity ? 1 : item.quantity
        }
        sortEquipment(equipment, item);
    }

    for(let key in items.choices) {
        let item = items.choices[key];
        if(Array.isArray(item.equipment)) {
            for(let choice of item.equipment) {
                if(choice.index != undefined) {
                    choice = {
                        ...choice.desc,
                        name: choice.name,
                        quantity: !choice.quantity ? 1 : choice.quantity
                    };
                    sortEquipment(equipment, choice);
                }
            }
        }
        else if (item.equipment.choose != undefined) {
            //ignore
        }
        else {
            item = {
                ...item.equipment.desc,
                name: item.equipment.name,
                quantity: !item.equipment.quantity ? 1 : item.equipment.quantity
            }
            sortEquipment(equipment, item);
        }

        if(item.selection != undefined) {
            for(let key in item.selection) {
                for(let choice of item.selection[key]) {
                    choice = {
                        ...choice.desc,
                        name: choice.name,
                        quantity: !choice.quantity ? 1 : choice.quantity
                    };
                    sortEquipment(equipment, choice);
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
    console.log(character.class.choices, character.race.choices, character.background.choices);
    sortChoices(userSelections, character.class.choices);
    sortChoices(userSelections, character.race.choices);
    character.background.choices && sortChoices(userSelections, character.background.choices);
    const level = character.level === undefined ? 1 : character.level;
    const proficiency_bonus = 1 + Math.ceil(level/4)
    console.log(userSelections);
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
            features: character.class.features.concat(userSelections.feature).concat(subclassFeatures), 
            traits: character.race.traits.concat(userSelections.trait).concat(subraceTraits), 
            background: {
                name: character.background.name,
            },
            class_specific: levelDetails.class_specific,
            proficiency_bonus: proficiency_bonus,
            misc_proficiencies: {
                armor: character.class.proficiencies.Armor.concat(character.race.proficiencies.Armor).concat(character.background.proficiencies.Armor).concat(userSelections.armor),
                weapons: character.class.proficiencies.Weapons.concat(character.race.proficiencies.Weapons).concat(character.background.proficiencies.Weapons).concat(userSelections.weapon),
                tools: character.class.proficiencies.Tools.concat(character.race.proficiencies.Tools).concat(character.background.proficiencies.Tools).concat(userSelections.tool),
                languages: character.class.proficiencies.Languages.concat(character.race.proficiencies.Languages).concat(character.background.proficiencies.Languages).concat(userSelections.language)
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
        console.log(model);
        return model;
}

const sortEquipment = (equipment, item) => {
    let category = item.category ? item.category.toLowerCase() : 'pack';
    if(category.includes("weapon")) {
        console.log(item);
        //if(category.includes("magic")) equipment.attacks.magic_weapons.push(item);
        /*else*/ equipment.attacks.weapons.push(item);
    }
    else if (category.includes("armor")) {
        console.log(item);
        item.equipped = false;
        equipment.equipped_armor.push(item);
    }
    else if (category.includes("currency")) {
        let separated = item.cost.match(/[a-z]+|[^a-z]+/gi);
        equipment.treasure[separated[1]] += separated[0];
    }
    else if (category.includes("treasure")) {
        equipment.treasure.other.push(item);
    }
    else {
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
        console.log(choice);
        for(let item of choice) {
            if(item && typeof item=== 'object') {
                console.log(item.name);
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
            let expertise = selections.expertise.find(aExp => aExp.toLowerCase().substring(aExp.name.toLowerCase.indexOf(':')+2).replaceAll(' ', '_') === skill);
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

    for(let armor of armorList) {
        if(armor.name.toLowerCase().includes('shield')) shield = true;
        let maxAC = armor.base + (armor.dex_bonus ? (armor.max_bonus && abScores.dex.modifier >= armor.max_bonus ? armor.max_bonus : abScores.dex.modifier) : 0);
        if(maxAC > best.maxAC) {
            best.maxAC = maxAC;
            best.armor = armor;
        }
    }
    return shield ? best.maxAC : best.maxAC + 2;
}

const levelSorter = async (charClass, charLevel) => {
    console.log("in levels sorter");
    let connection = `/api/classes/${charClass.toLowerCase()}/levels/${charLevel}`;
    console.log(connection);
    const thing =  await axios
          .get(connection)
          .then(level => {
            level = level.data;
            console.log(level);
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
              console.log(level);
              return level
    })
    return thing;
}

const spellsPopulator = (spells) => {
    console.log(spells);
    const cards = [[],[],[],[],[],[],[], [], []];
    for (let i = 0; i < 9; i++) {
        let key;
        if(spells[i] == undefined) break;
        if(i === 0) key = 'cantrips';
        else key=`level${i}`;
        let list = spells[i];
        for(let spell of list) {
            let found = spells.cards[key].find(card => card.index === spell)
            cards[i].push(found);
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
