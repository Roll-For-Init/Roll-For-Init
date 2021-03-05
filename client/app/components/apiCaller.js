const axios = require('axios').default;

const placeholderDescription = [
  'Please see the 5e SRD for more details @ https://dnd.wizards.com/articles/features/systems-reference-document-srd',
];

const optionsExtractor = async (container, key) => {
  let optionSet = {
    header: '',
    options: [],
    choose: 0,
  };

  optionSet.choose = container[key].choose;
  //console.log(container[key].from[0]);
  if (container[key].type.toLowerCase().includes('feature')) {
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
          axios.get(featureURL).then(details => {
            console.log(details.data);
            details = details.data;
            if (details.feature_choices.length > 0) {
              for (let set of details.feature_choices) {
                //console.log(set);
                axios.get(set.url).then(choice => {
                  optionsExtractor(choice.data, choice).then(choiceSet => {
                    classContainer.main.options.push(choiceSet);
                  });
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

module.exports = { propogateRacePointer, classCaller };
