const axios = require('axios');
const placeholderDescription = ["Please see the 5e SRD for more details @ https://dnd.wizards.com/articles/features/systems-reference-document-srd"];
const keywords = {
  //to do word associations for the rest of the program!
}

const fullAbScore = {
    CHA: "Charisma",
    INT: "Intelligence",
    STR: "Strength",
    WIS: "Wisdom",
    DEX: "Dexterity",
    CON: "Constitution"
}

const optionsHelper = async (container, options, key) => {
    let optionSet = {
        header: '',
        options: [],
        choose: 0,
      }  
      let equipmentSet = {
          header: '',
          options: [],
          choose: 0
      }

    optionSet.choose = options.choose;
    if(options.type.toLowerCase().includes("feature")) {
      optionSet.header = container.name;
      optionSet.desc = container.desc;
    } else if (options.type.toLowerCase().includes('language'))
      optionSet.header = `extra ${options.type}`;
    else optionSet.header = options.type.replace('_', " ");
    if (key.toLowerCase().includes('ability_bonus')) {
        optionSet.header = `+${options.from[0].bonus} Ability Bonus`
      for (let option of options.from) {
        option.ability_score.full_name = fullAbScore[option.ability_score.name];
        let optionName = option.ability_score.full_name;
        let optionObject = {
          name: optionName,
        };
        optionSet.options.push(optionObject);
      }
    } else if (
      !options.type.toLowerCase().includes('equipment') &&
      options.from[0].index.toLowerCase().includes('skill')
    ) {
      for (let option of options.from) {
        let optionName = option.name.substring(option.name.indexOf(':') + 2);
        let optionObject = {
          name: optionName,
        };
        optionSet.options.push(optionObject);
      }
    } else {
      if (options.type.toLowerCase().includes('equipment')) {
        for (let option of options.from) {
          if (option.equipment_option != undefined) {
              let optionObject = {
                  name: option.equipment_option.from.equipment_category.name,
                  url: option.equipment_option.from.equipment_category.url
              }
              optionSet.options.push(optionObject);
          } else if (option.equipment_category != undefined) {
              let optionObject = {
                  name: option.equipment_category.name,
                  url: option.equipment_category.url
              }
              equipmentSet.options.push(optionObject);
          } else {
            //console.log(option);
            if (option['0']) {
              let optionName;
              let urls = [];
              for (let i = 0; option[i] != undefined; i++) {
                  //console.log(option[i])
                if (option[i].equipment) {
                  optionName = `1 ${option[i].equipment.name}`;
                  urls.push(option[i].equipment.url)
                } else{
                  optionName = `${option[i].equipment_option.choose} ${option[i].equipment_option.from.equipment_category.name}`;
                  urls.push(option[i].equipment_option.from.equipment_category.url)
                }
                if (option[i + 1]) {
                  optionName += ' and ';
                }
              }
              let optionObject = {
                name: optionName,
                url: urls
              };
              equipmentSet.options.push(optionObject);
            } else {
                let optionObject = {
                    name: option.name ? option.name : option.equipment.name,
                    url: option.url ? option.url : option.equipment.url
                }
                equipmentSet.options.push(optionObject);
            }
          }
        }
      } else {
        for (let option of options.from) {
            let optionObject = {
                name: option.name,
                url: option.url
            }
            optionSet.options.push(optionObject);
        }
      }
    }
    if(equipmentSet.header=='') equipmentSet = null;
    if(optionSet.header=='') optionSet = null;
    return {options: optionSet, equipment: equipmentSet}
}
const optionsExtractor = async (container, key) => {
  let promises = [];
  let listOfOptions = container[key];
  let allOptions = [];
  let allEquipment = [];

  if(Array.isArray(listOfOptions)) {
      for (let options of listOfOptions) {
        let result = optionsHelper(container, options, key)
        promises.push(result);
        result.then((res) => {
            if(res.options) allOptions.push(res.options);
            if(res.equipment) allEquipment.push(res.equipment);
        })
      }
  }
  else {
    let result = optionsHelper(container, container[key], key)
    promises.push(result);
    result.then((res)=> {
        if(res.options) allOptions.push(res.options);
        if(res.equipment) allEquipment.push(res.equipment);
    
    })
  }
  return Promise.all(promises).then(() => {return {options: allOptions, equipment: allEquipment}}); 
};

const descriptionAdder = async (container, key) => {
  let promises = [];
  for (let item of container[key]) {
    promises.push(axios
      .get(item.url) //get description for given option
      .then(details => {
        details = details.data;
        let deets;
        if (details.desc) {
          deets = details.desc;
        } else deets = placeholderDescription;
        item.desc = deets;
        return
      })
      .catch(err => console.error(err)));
  }
  return Promise.all(promises);

};

const proficiencySorter = async (container, key, destination) => {
    let promises = [];
    let dest = destination;
    //console.log(destination);
    destination = destination.proficiencies;
  for (let proficiency of container[key]) {
    let type;
    let name;
    promises.push(axios
      .get(proficiency.url)
      .then(profDetails => {
        profDetails = profDetails.data;
        if (key.includes('language')) {
            type = 'Languages';
        }
        else if (profDetails.type == undefined) type = 'Throws';
        else if (
          profDetails.type.toLowerCase().includes('tool') ||
          profDetails.type.toLowerCase().includes('other')
        )
          type = 'Tools';

        else type = profDetails.type;
        name = profDetails.name;
        if (name.toLowerCase().includes('skill')) {
          name = name.substring(name.indexOf(':') + 2);
        }
        return
      })
      .then(() => {
        if(destination[type] == undefined) {    
            destination[type] = []; destination[type].push(name);}
        else destination[type].push(name);
        dest.profCount=1;
        return
      })
    )
  }
  return Promise.all(promises);
};

const propogateSubracePointer = async (subrace, raceContainer) => {
    const promises =[];

      Object.keys(subrace).forEach(key => {
        if(key.toLowerCase().includes("option") 
            || key.toLowerCase().includes("choice")) {
          promises.push(optionsExtractor(subrace, key)
            .then((options) => {
              raceContainer.options = raceContainer.options.concat(options.options);
              raceContainer.equipment = raceContainer.equipment.concat(options.equipment);
            }))
        }
        else if(key.toLowerCase().includes("trait")) {
          promises.push(descriptionAdder(subrace, key)
            .then());
        }
        else if(key.toLowerCase().includes("proficienc")
                || key.toLowerCase().includes("saving_throw") 
                || (key.toLowerCase().includes('language') && !key.toLowerCase().includes('_desc'))) {
          promises.push(proficiencySorter(subrace, key, raceContainer)
            .then());
        }
        else if (key.toLowerCase().includes('ability')) {
            for (let score of subrace[key]) {
               // console.log(score.ability_score);
               score.ability_score.full_name = fullAbScore[score.ability_score.name];
            }
        }
      });
      return Promise.all(promises);
};

const getRaceMiscDescriptions = async race => {
    let promises = [];
    for (optionSet of race.options) {
        optionSet.options.forEach(option => {
            if(!option.hasOwnProperty('url')) {return;}
            promises.push(axios.get(option.url)
            .then(optionDetails => {
                optionDetails = optionDetails.data;
                if(optionDetails.desc) option.desc = optionDetails.desc;
                else option.desc = placeholderDescription;
            })
            .catch(err => console.error(err)));
        })
    }
    return Promise.all(promises).then(() => {return race})
}

const propogateRacePointer = async racePointer => {
    const promises =[];
    const raceContainer = {
        options: [],
        profCount: 0,
        proficiencies: {},
        main: {},
        sub: {},
        equipment: []
    };
  const race = (await axios.get(racePointer.url)).data;
  const subrace = racePointer.hasOwnProperty('subrace') ? (await axios.get(racePointer.subrace.url)).data : null;
  if (subrace) promises.push(propogateSubracePointer(subrace, raceContainer));

  Object.keys(race).forEach(key => {
    if (
        key.toLowerCase().includes('option') ||
        key.toLowerCase().includes('choice')
    ){
        promises.push(optionsExtractor(race, key).then(options => {
          raceContainer.options = raceContainer.options.concat(options.options);
          raceContainer.equipment = raceContainer.equipment.concat(options.equipment);
        }));
      } else if (key.toLowerCase().includes('trait')) {
        promises.push(descriptionAdder(race, key).then());
      } else if (
        key.toLowerCase().includes('proficienc') ||
        key.toLowerCase().includes('saving_throw') ||
        (key.toLowerCase().includes('language') && !key.toLowerCase().includes('_desc'))
      ) {
          //console.log(raceContainer.main);
        promises.push(proficiencySorter(race, key, raceContainer).then());
      }
      else if (key.toLowerCase().includes('ability')) {
          for (let score of race[key]) {
             // console.log(score.ability_score);
             score.ability_score.full_name = fullAbScore[score.ability_score.name];
          }
      }
    });
  return Promise.all(promises).then(() => {
      raceContainer.main = race;
      raceContainer.sub = subrace;
      return raceContainer;
  });
};

const classCaller = async (classPointer) => {
  const promises = [];
  const classContainer = {
    main: {
      options: [],
      profCount: 0,
      proficiencies: {},
      features: [],
    },
    equipment: []
  };
    const theClass = (await axios.get(classPointer.url)).data; //fetch class
    Object.keys(theClass).forEach(key => {
        if (
            key.toLowerCase().includes('option') ||
            key.toLowerCase().includes('choice')
        ) {
            //console.log(key);
            promises.push(optionsExtractor(theClass, key).then(optionSet => {
                classContainer.main.options = classContainer.main.options.concat(optionSet.options);
                classContainer.equipment = classContainer.equipment.concat(optionSet.equipment);
            }));
        } else if (
            key.toLowerCase().includes('proficienc') ||
            key.toLowerCase().includes('saving_throw')
        ) {
            promises.push(proficiencySorter(
            theClass,
            key,
            classContainer.main
            ).then());
        }
    });
    let featureURL = `${theClass.class_levels}/1`;
    promises.push(axios.get(featureURL)
    .then((details) => {
        let morePromises = [];
        details = details.data;
        if(details.feature_choices.length >0) {
            for (let set of details.feature_choices) {
                //console.log(set);
                axios.get(set.url)
                .then((choice) => {
                    //console.log(choice.data);
                    morePromises.push(optionsExtractor(choice.data, 'choice')
                    .then(choiceSet => {
                        classContainer.main.options = classContainer.main.options.concat(choiceSet.options);
                    }))
                });
            }
        }
        else morePromises.push(descriptionAdder(details, 'features').then());
        return Promise.all(morePromises);
    }));

    return Promise.all(promises).then(() => {
        classContainer.main = {
            ...classContainer.main,
            ...theClass,
        }
        return classContainer;
    });
};

const getClassDescriptions = async () => {

}
const getBackgroundList = async () => {
  var backgrounds=[];

  let backgroundPointerList = await axios.get('/api/backgrounds'); //fetch the list of backgrounds
  let backgroundList = backgroundPointerList.data.results;
}

const backgroundCaller = async (url) => {
  let container = {
    name: '',
    proficiencies: {
        skills: [],
        saving_throws: [],
        armor: [],
        weapons: [],
        languages: [],
        tools: [],
    },
    options: [
      /*
        {
          choose: 0,
          header: "Choose ${choose}: ${type}",
          category: ''//i.e feature_ribbon, feature_utility, skill, language..
          description: 
          list: [
            //ribbon, language, skill
            {
              name: '',
              description: ''
            }
            //damaage/utility
            {
              name: '',
              description: '',
              mechanics: [],
              charges: {}
            }
          ]
        }
      */
    ], 
    feature: {/*name: '', description ['']*/},
    combat_equipment: {
      weapons: [
        /*{
          name: String,
          attack_type: String,
          damage_type: String,
          damage_dice: String,
          modifier: Number,
          ammunition: {
            current: Number,
            max: Number
          }
        }
        */
      ],
      armors: [
      /*{
        name: String,
        description: String,
        type: String,        // e.g. light, medium, heavy
        base_ac: Number,
        modifier: String,    // modifier is max +2 bonus?
        mechanics: [
          {
            skill: String,
            stat: Number,
            is_active: {
              type: Boolean,
              default: false
            }
        }
        ],*/
      ],
    },
    inventory: [
      /*
      {
        name: String,
        description: String,
        category: String,
        weight: Number,
        quantity: Number,
        cost: {
          amount: Number,
          denomination: String        // e.g. "gp", "sp", etc.
        },
    }
    */
    ],
    treasure: {
      /*
      cp: Number,
      sp: Number,
      ep: Number,
      gp: Number,
      pp: Number,
      other: [
        {
          name: String,
          value: Number
        }
      ]*/
    },
  };

  axios.get(url).then((background) => {
      background = background.data;
      Object.keys(background).forEach(key => {
        if(key.toLowerCase().includes("option") || key.toLowerCase().includes("choice")) {
         // console.log(background[key]);
            if(Array.isArray(background[key])) {
                for (let options of background[key]) {
                    let temp = {
                        key: {}
                    };
                    temp[key] = options;
                    optionsExtractor(temp, key)
                    .then(optionSet => {
                        container.options.push(optionSet);
                    })
                }
            }
            else {
                optionsExtractor(background, key)
                .then(optionSet => {
                    container.options.push(optionSet);
                })
            }
                
        }
        else if(key.toLowerCase().includes("proficienc")|| key.toLowerCase().includes("saving_throw")) {
          proficiencySorter(background, key, container.proficiencies)
            .then();
        }
      });
      return background;
  })
  .then((background) => {
    container = {
      ...container,
      ...background
    };
    
    return container;
  })
}

const getAlignments = async () => {
    axios.get('/api/alignments').then((alignments) => {return alignments.data.results});
}
//for background to work, need to array within _options until you get to the "type" key

/*
useEffect(() => {
    const fetchData = async () => {
      apiData = await classCaller();
      console.log(apiData);
      /*apiData.main for the top level race, .sub for the subrace. pull qualities from .main and .sub together to form the interface.
        all properties are the same as in the api, but you can access .desc for those that were pointers before, such as in traits and options.
        there are also two properties in .main and .sub, .options and .proficiencies, that group all options and proficiencies together.
        proficiencies are sorted into .weapons, .armor, .languages, .skills, .tools, and .throws. 
        options is an array where each object in it has a .choose (with how many you should choose, an integer), .header (the type, ie "extra language")
          and .options subarray with .name and .desc in each. 
        ANY .DESC DESCRIPTION IS AN ARRAY. proceeed accordingly.
      
    }
    fetchData();
  }, []);
  import {raceCaller, classCaller} from "../apiCaller";

*/

module.exports = { classCaller, backgroundCaller, propogateRacePointer,getRaceMiscDescriptions, getClassDescriptions};

