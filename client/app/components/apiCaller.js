const axios = require('axios');
const placeholderDescription = ["Please see the 5e SRD for more details @ https://dnd.wizards.com/articles/features/systems-reference-document-srd"];

const optionsExtractor = async (container, key) => {
  let optionSet = {
    options: [],
    choose: 0,
  }  

  optionSet.choose = container[key].choose;
  if(container[key].type.toLowerCase().includes("language")) optionSet.header = `extra ${container[key].type}`;
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
        type = profDetails.type.toLowerCase();
        if (type.toLowerCase().includes("tool")) type = "tools";
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
          tools: []
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
                    if(key.toLowerCase().includes("option")) {
                      optionsExtractor(subrace, key)
                        .then(optionSet => {
                          sub.options.push(optionSet);
                        })
                    }
                    else if(key.toLowerCase().includes("trait")) {
                      descriptionAdder(subrace, key)
                        .then();
                    }
                    else if(key.toLowerCase().includes("proficienc")) {
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
            if(key.toLowerCase().includes("option")) {
             optionsExtractor(race, key)
                .then(optionSet => {
                    raceContainer.main.options.push(optionSet);
                })
           }
            else if(key.toLowerCase().includes("trait")) {
              descriptionAdder(race, key)
                .then();
            }
            else if(key.toLowerCase().includes("proficienc")) {
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

const classCaller = () => {

}

module.exports = {raceCaller, classCaller}
