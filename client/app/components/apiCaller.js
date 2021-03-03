const axios = require('axios');
const placeholderDescription = ["Please see the 5e SRD for more details @ https://dnd.wizards.com/articles/features/systems-reference-document-srd"];

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
  }
  else if(container[key].type.toLowerCase().includes("language")) optionSet.header = `extra ${container[key].type}`;
  else optionSet.header = container[key].type.replace('_',/\s/g);
  if(!key.toLowerCase().includes("ability_bonus")) {
    for (let option of container[key].from) {
        axios.get(option.url) //get description for given option
        .then((optionDetails) => {
          optionDetails = optionDetails.data;
          let optionName = option.name;
          let optionDeets;
          if(optionDetails.desc) {
            optionDeets = optionDetails.desc;
          }
          else optionDeets = placeholderDescription;
          let optionObject = {
            name: optionName,
            desc: optionDeets
          }
          optionSet.options.push(optionObject);
        })
        .catch(err => console.error(err));
    }
  }
  else {
    for (let option of container[key].from) {
      let optionName = option.ability_score.name;
      let optionDeets = `+${option.bonus}`;
      let optionObject = {
        name: optionName,
        desc: optionDeets
      }
      optionSet.options.push(optionObject);
    }
  }
  return optionSet;
}

const descriptionAdder = async(container, key) => {
  for (let item of container[key]) {
    axios.get(item.url) //get description for given option
      .then((details) => {
        details=details.data;
        let deets;
        if(details.desc) {
          deets = details.desc;
        }
        else deets = placeholderDescription;
        item.desc = deets;
      })
      .catch(err => console.error(err));
  }
  return;
}

const proficiencySorter = async(container, key, destination) => {
  for (let proficiency of container[key]) {
    let type;
    let name;
    axios.get(proficiency.url)
      .then((profDetails) => {
        profDetails = profDetails.data;
        if (!profDetails.type) type="throws";
        else if (profDetails.type.toLowerCase().includes("tool")) type = "tools";
        else type = profDetails.type.toLowerCase();
        name = profDetails.name;
        if (name.toLowerCase().includes("skill")) {
          name = name.substring(name.indexOf(':')+1);
        }
      })
      .then(() => {
        destination[type].push(name);
      })
      .catch(err => console.error(err));
  }
  return;
}

const raceCaller = async () => {
  var races=[];

  let racePointerList = await axios.get('/api/races'); //fetch the list of races
  let raceList = racePointerList.data.results;
  //console.log(raceList);
  
  let promises = [];
  for(let racePointer of raceList) { 
    let raceContainer = {
      main: {
        options: [],
        proficiencies: {
          weapons: [],
          skills: [],
          languages: [],
          tools: [],
          throws: []
        }
      },
      sub: [/*{
        
        options: [],
        proficiencies: {
          weapons: [],
          skills: [],
          languages: [],
          tools: []
        }
        
      }*/],
    };
  
    promises.push(
      axios.get(racePointer.url)
        .then((race) => { //fetch each race in the api
          race = race.data;
          raceContainer.main.options = [];
          raceContainer.main.proficiencies = {
            weapons: [],
            skills: [],
            languages: [],
            tools: []
          }
          //console.log(race);

          if(race.subraces.length > 0) {
            for(let subracePointer of race.subraces) {
              //console.log(subracePointer.url);
              axios.get(subracePointer.url) //fetch each subrace for that race
                .then((subrace) => {
                  subrace = subrace.data;
                  let sub = {
                    options: [],
                    proficiencies: {
                      weapons: [],
                      skills: [],
                      languages: [],
                      tools: []
                    }
                  }

                  Object.keys(subrace).forEach(key => {
                    if(key.toLowerCase().includes("option") || key.toLowerCase().includes("choice")) {
                      optionsExtractor(subrace, key)
                        .then(optionSet => {
                          sub.options.push(optionSet);
                        })
                    }
                    else if(key.toLowerCase().includes("trait")) {
                      descriptionAdder(subrace, key)
                        .then();
                    }
                    else if(key.toLowerCase().includes("proficienc") || key.toLowerCase().includes("saving_throw")) {
                      proficiencySorter(subrace, key, sub.proficiencies)
                        .then();
                    }
                  });
                  raceContainer.sub.push({
                    ...sub,
                    ...subrace,
                 });
              });
            }
          }
          Object.keys(race).forEach(key => {
            if(key.toLowerCase().includes("option") || key.toLowerCase().includes("choice")) {
              optionsExtractor(race, key)
                .then(optionSet => {
                    raceContainer.main.options.push(optionSet);
                })
            }
            else if(key.toLowerCase().includes("trait")) {
              descriptionAdder(race, key)
                .then();
            }
            else if(key.toLowerCase().includes("proficienc")|| key.toLowerCase().includes("saving_throw")) {
              proficiencySorter(race, key, raceContainer.main.proficiencies)
                .then();
            }
          }); 
          return race;
      })
      .then((race) => {
        raceContainer.main = {
          ...raceContainer.main,
          ...race
        };
        races.push(raceContainer);   
      })
    );
  }
  return Promise.all(promises).then(() => races);
    //need to add recursion or something so that descriptions can be had from options! make descriptions, weight, cost available without another fetch. maybe just upon selection of option??
    //should unify race, subrace "trait" call language. is this easy to use? things are still stratified across race and subrace...same with options vs choices
    //need a "fluff" equipment array, later
    //note: 'desc' is an array...
    //ensure compatibility with gameplay and character sheet model. i.e., racial traits have mechanics in plain string form. 
      //will things be determined as combat/ribbon/etc within the database, or here? how are things sorted?
      //should everything go in "ribbon" for now and gameplay can be separated out later?
      //for stuff like resistances that will be grouped together in the model but are all over the traits here, with no indication the trait is a resistance...how? 
}

const classCaller = async () => {
  var classes=[];

  let classPointerList = await axios.get('/api/classes'); //fetch the list of races
  let classList = classPointerList.data.results;
  
  let promises = [];
  for(let classPointer of classList) { 
    let classContainer = {
      main: {
        options: [],
        proficiencies: {
          weapons: [],
          skills: [],
          languages: [],
          tools: [],
          throws: []
        },
        features: []
      }
    };
  
    promises.push(
      axios.get(classPointer.url)
        .then((theClass) => { //fetch each class in the api
          theClass = theClass.data;

          Object.keys(theClass).forEach(key => {
            if(key.toLowerCase().includes("option") || key.toLowerCase().includes("choice")) {
              optionsExtractor(theClass, key)
                .then(optionSet => {
                    classContainer.main.options.push(optionSet);
                })
            }
            else if(key.toLowerCase().includes("proficienc")|| key.toLowerCase().includes("saving_throw")) {
              proficiencySorter(theClass, key, classContainer.main.proficiencies)
                .then();
            }
          }); 
          let featureURL = `${theClass.class_levels}/1`;
          axios.get(featureURL)
            .then((details) => {
              details = details.data;
              if(details.data.feature_choices.length >0) {
                for (let set of details.data.feature_choices) {
                  axios.get(set.url)
                    .then((choice) => {
                      optionsExtractor(choice.data, choice)
                        .then(choiceSet => {
                          classContainer.main.options.push(choiceSet);
                        })
                      });
                }
              }
              descriptionAdder(details.data,features)
                .then();
            })
          return theClass;
      })
      .then((theClass) => {
        classContainer.main = {
          ...classContainer.main,
          ...theClass
        };
        classes.push(classContainer);   
      })
    );
  }
  return Promise.all(promises).then(() => classes);
}

module.exports = {raceCaller, classCaller}
