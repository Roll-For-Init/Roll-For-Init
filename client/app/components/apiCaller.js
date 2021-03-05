const axios = require('axios');
const placeholderDescription = ["Please see the 5e SRD for more details @ https://dnd.wizards.com/articles/features/systems-reference-document-srd"];
const keywords = {
  //to do word associations for the rest of the program!
}
const optionsExtractor = async (container, key) => {
  let optionSet = {
    header: '',
    options: [],
    choose: 0,
  }  
 
  optionSet.choose = container[key].choose;
  if(container[key].type.toLowerCase().includes("feature")) {
    optionSet.header = container.name;
    optionSet.desc = container.desc;
  } else if (container[key].type.toLowerCase().includes('language'))
    optionSet.header = `extra ${container[key].type}`;
  else optionSet.header = container[key].type.replace('_', /\s/g);
  if (key.toLowerCase().includes('ability_bonus')) {
    for (let option of container[key].from) {
      let optionName = option.ability_score.name;
      let optionDeets = `+${option.bonus}`;
      let optionObject = {
        name: optionName,
        desc: optionDeets,
      };
      optionSet.options.push(optionObject);
    }
  } else if (
    !container[key].type.toLowerCase().includes('equipment') &&
    container[key].from[0].index.toLowerCase().includes('skill')
  ) {
    for (let option of container[key].from) {
      let optionName = option.name.substring(option.name.indexOf(':') + 1);
      let optionDeets = placeholderDescription;
      let optionObject = {
        name: optionName,
        desc: optionDeets,
      };
      optionSet.options.push(optionObject);
    }
  } else {
    if (container[key].type.toLowerCase().includes('equipment')) {
      for (let option of container[key].from) {
        if (option.equipment_option != undefined) {
          axios
            .get(option.equipment_option.from.equipment_category.url) //get description for given option
            .then(optionDetails => {
              optionDetails = optionDetails.data;
              for (let item in optionDetails.equipment) {
                let optionName = item.name;
                let optionDeets;
                if (optionDetails.desc) {
                  optionDeets = optionDetails.desc;
                } else optionDeets = placeholderDescription;
                let optionObject = {
                  name: optionName,
                  desc: optionDeets,
                };
                optionSet.options.push(optionObject);
              }
            })
            .catch(err => console.error(err));
        } else if (option.equipment_category != undefined) {
          axios
            .get(option.equipment_category.url) //get description for given option
            .then(optionDetails => {
              optionDetails = optionDetails.data;
              for (let item in optionDetails.equipment) {
                let optionName = item.name;
                let optionDeets;
                if (optionDetails.desc) {
                  optionDeets = optionDetails.desc;
                } else optionDeets = placeholderDescription;
                let optionObject = {
                  name: optionName,
                  desc: optionDeets,
                };
                optionSet.options.push(optionObject);
              }
            })
            .catch(err => console.error(err));
        } else {
          //console.log(option);
          if (option['0']) {
            let optionName;
            for (let i = 0; option[`${i}`]; i++) {
              if (option[`${i}`].equipment) {
                optionName = `1 ${option[i].equipment.name}`;
              } else
                optionName = `${option[i].equipment_option.choose} ${option[i].equipment_option.from.equipment_category.name}`;

              if (option[i + 1]) {
                optionName += ' and ';
              }
            }
            let optionObject = {
              name: optionName,
              desc: placeholderDescription,
            };
            optionSet.options.push(optionObject);
          } else {
            axios
              .get(option.equipment.url) //get description for given option
              .then(optionDetails => {
                optionDetails = optionDetails.data;

                let optionName = option.name;
                let optionDeets;
                if (optionDetails.desc) {
                  optionDeets = optionDetails.desc;
                } else optionDeets = placeholderDescription;
                let optionObject = {
                  name: optionName,
                  desc: optionDeets,
                };
                optionSet.options.push(optionObject);
              })
              .catch(err => console.error(err));
          }
        }
      }
    } else {
      for (let option of container[key].from) {
        axios
          .get(option.url) //get description for given option
          .then(optionDetails => {
            optionDetails = optionDetails.data;
            let optionName = option.name;
            let optionDeets;
            if (optionDetails.desc) {
              optionDeets = optionDetails.desc;
            } else optionDeets = placeholderDescription;
            let optionObject = {
              name: optionName,
              desc: optionDeets,
            };
            optionSet.options.push(optionObject);
          })
          .catch(err => console.error(err));
      }
    }
  }
  return optionSet;
};

const descriptionAdder = async (container, key) => {
  for (let item of container[key]) {
    axios
      .get(item.url) //get description for given option
      .then(details => {
        details = details.data;
        let deets;
        if (details.desc) {
          deets = details.desc;
        } else deets = placeholderDescription;
        item.desc = deets;
      })
      .catch(err => console.error(err));
  }
  return;
};

const proficiencySorter = async (container, key, destination) => {
  for (let proficiency of container[key]) {
    let type;
    let name;
    axios
      .get(proficiency.url)
      .then(profDetails => {
        profDetails = profDetails.data;
        //console.log(profDetails);

        if (profDetails.type == undefined) type = 'throws';
        else if (
          profDetails.type.toLowerCase().includes('tool') ||
          profDetails.type.toLowerCase().includes('other')
        )
          type = 'tools';
        else type = profDetails.type.toLowerCase();
        name = profDetails.name;
        if (name.toLowerCase().includes('skill')) {
          name = name.substring(name.indexOf(':') + 2);
        }
      })
      .then(() => {
        destination[type].push(name);
      })
      .catch(err => console.error(err));
  }
  return;
};

// const raceCaller = async () => {
//   // var races = [];
//   // let racePointerList = await axios.get('/api/races'); //fetch the list of races
//   // let raceList = racePointerList.data.results;
//   // let promises = [];
//   // return Promise.all(promises).then(() => races);
//   return;

//   //need to add recursion or something so that descriptions can be had from options! make descriptions, weight, cost available without another fetch. maybe just upon selection of option??
//   //should unify race, subrace "trait" call language. is this easy to use? things are still stratified across race and subrace...same with options vs choices
//   //need a "fluff" equipment array, later
//   //note: 'desc' is an array...
//   //ensure compatibility with gameplay and character sheet model. i.e., racial traits have mechanics in plain string form.
//   //will things be determined as combat/ribbon/etc within the database, or here? how are things sorted?
//   //should everything go in "ribbon" for now and gameplay can be separated out later?
//   //for stuff like resistances that will be grouped together in the model but are all over the traits here, with no indication the trait is a resistance...how?
// };

const propogateSubracePointer = async subracePointer => {
  return axios
    .get(subracePointer.url) //fetch each subrace for that race
    .then(response => {
      const subrace = response.data;
      let sub = {
        options: [],
        proficiencies: {
          weapons: [],
          skills: [],
          languages: [],
          tools: [],
          throws: [],
          armor: [],
        },
      };

      Object.keys(subrace).forEach(key => {
        if (
          key.toLowerCase().includes('option') ||
          key.toLowerCase().includes('choice')
        ) {
          optionsExtractor(subrace, key).then(optionSet => {
            sub.options.push(optionSet);
          });
        } else if (key.toLowerCase().includes('trait')) {
          descriptionAdder(subrace, key).then();
        } else if (
          key.toLowerCase().includes('proficienc') ||
          key.toLowerCase().includes('saving_throw')
        ) {
          proficiencySorter(subrace, key, sub.proficiencies).then();
        }
      });
      return {
        ...sub,
        ...subrace,
      };
    });
};

const propogateRacePointer = async racePointer => {
  let raceContainer = {
    main: {
      options: [],
      proficiencies: {
        weapons: [],
        skills: [],
        languages: [],
        tools: [],
        throws: [],
        armor: [],
      },
    },
    sub: [
      /*{
      
      options: [],
      proficiencies: {
        weapons: [],
        skills: [],
        languages: [],
        tools: []
      }
      
    }*/
    ],
  };

  return axios
    .get(racePointer.url)
    .then(response => {
      //fetch each race in the api
      const race = response.data;
      raceContainer.main.options = [];
      raceContainer.main.proficiencies = {
        weapons: [],
        skills: [],
        languages: [],
        tools: [],
        throws: [],
        armor: [],
      };
      //console.log(race);

      if (race.subraces.length > 0) {
        for (let subracePointer of race.subraces) {
          raceContainer.sub.push(propogateSubracePointer(subracePointer));
        }
      }

      Object.keys(race).forEach(key => {
        if (
          key.toLowerCase().includes('option') ||
          key.toLowerCase().includes('choice')
        ) {
          optionsExtractor(race, key).then(optionSet => {
            raceContainer.main.options.push(optionSet);
          });
        } else if (key.toLowerCase().includes('trait')) {
          descriptionAdder(race, key).then();
        } else if (
          key.toLowerCase().includes('proficienc') ||
          key.toLowerCase().includes('saving_throw')
        ) {
          proficiencySorter(race, key, raceContainer.main.proficiencies).then();
        }
      });
      return race;
    })
    .then(race => {
      raceContainer.main = {
        ...raceContainer.main,
        ...race,
      };
      return raceContainer;
    });
};

const classCaller = async () => {
  var classes = [];

  let classPointerList = await axios.get('/api/classes'); //fetch the list of races
  let classList = classPointerList.data.results;

  let promises = [];
  for (let classPointer of classList) {
    let classContainer = {
      main: {
        options: [],
        proficiencies: {
          weapons: [],
          skills: [],
          languages: [],
          tools: [],
          throws: [],
          armor: [],
        },
        features: [],
      },
    };

    classContainer.main.options = [];
    classContainer.main.proficiencies = {
      weapons: [],
      skills: [],
      languages: [],
      tools: [],
      throws: [],
      armor: [],
    };
    promises.push(
      axios
        .get(classPointer.url)
        .then(theClass => {
          //fetch each class in the api
          theClass = theClass.data;

          Object.keys(theClass).forEach(key => {
            if (
              key.toLowerCase().includes('option') ||
              key.toLowerCase().includes('choice')
            ) {
              for (let set of theClass[key]) {
                let temp = {};
                temp[key] = set;
                optionsExtractor(temp, key).then(optionSet => {
                  classContainer.main.options.push(optionSet);
                });
              }
            } else if (
              key.toLowerCase().includes('proficienc') ||
              key.toLowerCase().includes('saving_throw')
            ) {
              proficiencySorter(
                theClass,
                key,
                classContainer.main.proficiencies
              ).then();
            }
          });
          let featureURL = `${theClass.class_levels}/1`;
          axios.get(featureURL)
            .then((details) => {
              details = details.data;
              if(details.feature_choices.length >0) {
                for (let set of details.feature_choices) {
                  //console.log(set);
                  axios.get(set.url)
                    .then((choice) => {
                      optionsExtractor(choice.data, choice)
                        .then(choiceSet => {
                          classContainer.main.options.push(choiceSet);
                        })
                      });
                }
              }
            descriptionAdder(details, 'features').then();
          });
          return theClass;
        })
        .then(theClass => {
          classContainer.main = {
            ...classContainer.main,
            ...theClass,
          };
          classes.push(classContainer);
        })
    );
  }
  return Promise.all(promises).then(() => classes);
};

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
    console.log(container);
    return container;
  })
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

module.exports = { classCaller, backgroundCaller, propogateRacePointer};

