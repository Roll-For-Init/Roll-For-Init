const parseEquipment = (items) => {
    console.log(items);
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
        sortEquipment(equipment, item);
    }

    for(let key in items.choices) {
        let item = items.choices[key];
        if(Array.isArray(item.equipment)) {
            for(let choice of item.equipment) {
                if(choice.index != undefined) {
                    sortEquipment(equipment, choice);
                }
            }
        }
        else if (item.equipment.choose != undefined) {
            //ignore
        }
        else sortEquipment(equipment, item.equipment);

        if(item.selection != undefined) {
            for(let key in item.selection) {
                for(let choice of item.selection[key]) {
                    sortEquipment(equipment, choice);
                }
            }
        }
    }
    return equipment;
}

const fillModel = (equipment, character) => { //will probably need a separate way to update an existing model
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
    sortChoices(userSelections, character.class.choices);
    sortChoices(userSelections, character.race.choices);
    character.background.choices && sortChoices(userSelections, character.background.choices);
    const level = character.level === undefined ? 1 : character.level;
    const proficiency_bonus = 1 + Math.ceil(level/4)
    const ability_relevant = abilityScoreParser(character.abilities, userSelections, proficiency_bonus);
    let health = character.class.hit_die + ability_relevant.ability_scores.con.modifier;//only works for 1st level
    if(character.subrace == 'Hill Dwarf') health+= level;
    let userFeatures = userSelections.feature;
    let subclassFeatures = character.subclass ? character.subclass.subclass_features : [];
    let subraceTraits = character.subrace ? character.subrace.racial_traits : [];

    try {
        const model = {
            charID: character.charID, 
            name: '', //TEMP
            level: level, 
            experience: {
                current: 0,
                threshold: expPerLevel[level]
            },
            race: {
                name: character.race.index,
                description: character.race.description
            },
            class: [{ //Will need to do a loop to fill any other classes
                name: character.class.index,
                levels: character.class.level 
            }],
            features: character.class.features.concat(userFeatures).concat(subclassFeatures), 
            traits: character.race.traits.concat(userSelections.trait).concat(subraceTraits), 
            background: {
                name: character.background.name,
            },
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
            ac: acCalculator(equipment.equipped_armor, ability_relevant.ability_scores.dex.modifier), 
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
            spells: character.spells ? {
                slots: spellSlotSorter(character.class.levels, level),
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
    catch (error) {
        console.error(error);
    }
    
}

const sortEquipment = (equipment, item) => {
    let category = item.desc.category ? item.desc.category.toLowerCase() : 'pack';
    if(category.includes("weapon")) {
        if(category.includes("magic")) equipment.attacks.magic_weapons.push(item);
        else equipment.attacks.weapons.push(item);
    }
    else if (category.includes("armor")) {
        equipment.equipped_armor.push(item);
    }
    else if (category.includes("currency")) {
        let separated = item.desc.cost.match(/[a-z]+|[^a-z]+/gi);
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
        console.log(key1);
        choices[category].concat(parent[key1]);
    }
}

const abilityScoreParser = (abilities, selections, proficiency) => {
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
    console.log(abilities);
    for(let ability in abilities) {
        console.log(ability);
        ability = abilities[ability];
        console.log(ability);
        scores.ability_scores[ability.short_name] = {
            score: ability.finalScore,
            modifier: ability.modifier,
            advantage: 0
        }
        console.log(scores);
        for(let skill of skillScores[ability.short_name]) {
            console.log(skill);
            let proficiencyExists = selections.skill.find(aSkill => aSkill.name.toLowerCase.replaceAll(' ', '_') === skill);
            let expertise = selections.expertise.find(aExp => aExp.name.toLowerCase.substring(aExp.name.toLowerCase.indexOf(':')+2).replaceAll(' ', '_') === skill);
            scores.skills[skill] = {
                proficiency: !proficiencyExists ? false : true,
                modifier: !expertise ? ability.modifier + (!proficiency ? 0 : proficiency) : ability.modifier + (proficiency * 2), 
                advantage: 0
            }
        }
        let proficiencyExists = selections.throw.find(aThrow => aThrow.index === ability.short_name);
        scores.saving_throws[ability.short_name] = {
            proficiency: !proficiencyExists ? false : true,
            modifier: !proficiencyExists ? ability.modifier : ability.modifier + proficiency,
            advantage: 0
        }
    }
    return scores;
}

const acCalculator = (armorList, dex) => {
    let best = {
        armor: {},
        maxAC: 0
    }
    let shield = false;
    for(let armor of armorList) {
        if(armor.name.toLowerCase().includes('shield')) shield = true;
        let maxAC = armor.armor_class.base + (armor.dex_bonus ? (armor.max_bonus && dex >= armor.max_bonus ? armor.max_bonus : dex) : 0);
        if(maxAC > best.maxAC) {
            best.maxAC = maxAC;
            best.armor = armor;
        }
    }
    return shield ? best.maxAC : best.maxAC + 2;
}

const spellSlotSorter = (levelsArray, charLevel) => {
    console.log(levelsArray)
    slots = [];
    for(let level of levelsArray) {
        console.log(level)
        if(level.level === charLevel) {
            if(level.spellcasting) {
                for(let i = 1; i <= 9; i++) {
                    let key = `spell_slots_level_${i}`;
                    slots.push({
                        current: level.spellcasting[key],
                        max: level.spellcasting[key]
                    })
                }
                break;
            }
            else continue;
        }
    }
    return slots;
}

const spellsPopulator = (spells) => {
    console.log(spells);
    const cards = [[],[],[],[],[],[],[], [], []];
    for (let i = 0; i < 9; i++) {
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
