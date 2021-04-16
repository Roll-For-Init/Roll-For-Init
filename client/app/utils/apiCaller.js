const axios = require('axios');
const placeholderDescription = [
  'Please see the 5e SRD for more details @ https://dnd.wizards.com/articles/features/systems-reference-document-srd',
];
const keywords = {
  //to do word associations for the rest of the program!
};

const fullAbScore = {
  CHA: 'Charisma',
  INT: 'Intelligence',
  STR: 'Strength',
  WIS: 'Wisdom',
  DEX: 'Dexterity',
  CON: 'Constitution',
};

const makeEquipmentDesc = async (item, itemDetails) => {
  let desc;
  if (
    itemDetails.gear_category &&
    itemDetails.gear_category.index == 'equipment-packs'
  ) {
    desc = {
      cost: `${itemDetails.cost.quantity}${itemDetails.cost.unit}`,
      contents: itemDetails.contents,
    };
  } else if (
    itemDetails.equipment_category.index == 'weapon' &&
    itemDetails.special == undefined
  ) {
    desc = {
      category: `${itemDetails.category_range} Weapon`,
      damage: {
        damage_type: itemDetails.damage.damage_type.name,
        damage_dice: itemDetails.damage.damage_dice
      },
      cost: `${itemDetails.cost.quantity}${itemDetails.cost.unit}`,
      weight: itemDetails.weight,
      desc: itemDetails.properties.map(prop => prop.name).join(', '),
    };
    if(itemDetails.two_handed_damage != undefined) {
        desc.damage.two_handed = {
            damage_type: itemDetails.two_handed_damage.damage_type.name,
            damage_dice: itemDetails.two_handed_damage.damage_dice
        }
    }
    if (itemDetails.range != undefined) {
        desc.range = itemDetails.range;
      }  
  } else if (itemDetails.equipment_category.index == 'armor') {
    let armorClassDeets = itemDetails.armor_class;
    let ac = armorClassDeets.dex_bonus
      ? `${armorClassDeets.base} + Dex. modifier`
      : `${armorClassDeets.base}`;
    desc = {
      category: `${itemDetails.armor_category} Armor`,
      ac: ac,
      cost: `${itemDetails.cost.quantity}${itemDetails.cost.unit}`,
      weight: itemDetails.weight,
      dex_bonus: armorClassDeets.dex_bonus,
      max_bonus: armorClassDeets.max_bonus,
      base: armorClassDeets.base,
      str_minimum: itemDetails.str_minimum,
      stealth_disadvantage: itemDetails.stealth_disadvantage,
    };
    if (itemDetails.str_minimum > 0) desc.strength = itemDetails.str_minimum;
    if (itemDetails.stealth_disadvantage) desc.desc = 'stealth disadvantage';
  } else {
    desc = {
      category: null,
      quantity: null,
      cost: null,
      weight: null,
      desc: null,
    };
    let keys = Object.keys(itemDetails);
    for (let key in keys) {
      if (key.includes('category') && !key.includes('equipment')) {
        desc.category =
          typeof itemDetails[key] == 'string'
            ? itemDetails[key]
            : itemDetails[key].name;
        break;
      }
    }
    if (itemDetails.weapon_category != undefined)
      desc.category = `${itemDetails.category_range} Weapon`;
    if (itemDetails.damage != undefined)
      desc.damage = {
          damage_type: itemDetails.damage.damage_type.name,
          damage_dice: itemDetails.damage.damage_dice
      }
      if(itemDetails.two_handed_damage != undefined) {
          desc.damage.two_handed = {
              damage_type: itemDetails.two_handed_damage.damage_type.name,
              damage_dice: itemDetails.two_handed_damage.damage_dice
          }
      }
    if (itemDetails.quantity != undefined) desc.quantity = itemDetails.quantity;
    if (itemDetails.cost != undefined)
      desc.cost = `${itemDetails.cost.quantity}${itemDetails.cost.unit}`;
    if (itemDetails.weight != undefined) desc.weight = itemDetails.weight;
    if (itemDetails.special != undefined)
      desc.special = itemDetails.special.join(' ');
    if (itemDetails.range != undefined) {
      desc.range = itemDetails.range;
    }
    if (itemDetails.desc != undefined) desc.desc = itemDetails.desc;
    else if (itemDetails.properties != undefined)
      desc.desc = itemDetails.properties.map(prop => prop.name).join(', ');
  }
  return desc;
};
const equipmentOptions = async (container, options, key) => {
  const promises = [];
  let equipmentSet = {
    header: '',
    from: [],
    choose: 0,
  };
  equipmentSet.choose = options.choose;
  equipmentSet.header = options.type.replace('_', ' ');
  for (let option of options.from) {
    if (option.equipment_option != undefined) {
      let optionObject = option.equipment_option;
      if (optionObject.from.equipment_category != undefined) {
        optionObject.header = optionObject.from.equipment_category.name;
      }

      equipmentSet.from.push(optionObject);
    } else if (option.equipment_category != undefined) {
      //console.log(option);
      let optionObject = option;
      equipmentSet.header = optionObject.equipment_category.name;
      promises.push(
        axios.get(optionObject.equipment_category.url).then(cat => {
          equipmentSet.from = cat.data.equipment;
        })
      );
    } else {
      //console.log(option);
      if (option['0']) {
        let options = [];
        for (let i = 0; option[i] != undefined; i++) {
          let optionObject;

          if (option[i].equipment) {
            optionObject = option[i].equipment;
            optionObject.quantity = option[i].quantity;
          } else {
            optionObject = option[i].equipment_option;
            optionObject.header = optionObject.from.equipment_category.name;
          }
          options.push(optionObject);
        }
        equipmentSet.from.push(options);
      } else {
        let optionObject = {
          name: option.name ? option.name : option.equipment.name,
          url: option.url ? option.url : option.equipment.url,
          index: option.index ? option.index : option.equipment.index,
          quantity: option.quantity,
        };
        equipmentSet.from.push(optionObject);
      }
    }
  }
  return Promise.all(promises).then(() => {
    return { equipment: equipmentSet };
  });
};

const optionsHelper = async (container, options, key) => {
  const promises = [];
  let optionSet = {
    header: '',
    options: [],
    type: '',
    choose: 0,
  };
  optionSet.choose = options.choose;
  if (options.type.toLowerCase().includes('feature')) {
    optionSet.header = container.name;
    optionSet.desc = container.desc;
    optionSet.type = 'feature';
  } else if (options.type.toLowerCase().includes('trait')) {
    //console.log(options);
    optionSet.header = options.header
      ? options.header
      : options.type.replace('_', ' ');
    optionSet.type = 'trait';
    if(options.desc) optionSet.desc = options.desc;
  } else if (options.type.toLowerCase().includes('language')) {
    optionSet.header = `extra ${options.type}`;
    optionSet.type = options.type;
  }
  else if (options.type.toLowerCase().includes('prof') && !options.from[0].index.toLowerCase().includes('skill')) {
    optionSet.type = options.type;
    optionSet.header = 'tool';
  } else {
    optionSet.header = options.type.replace('_', ' ');
    optionSet.type = options.type;
  }
  for (let option of options.from) {
    if (key.toLowerCase().includes('ability_bonus')) {
      optionSet.header = `+${options.from[0].bonus} Ability Bonus`;
      option.ability_score.full_name = fullAbScore[option.ability_score.name];
      optionSet.options.push(option.ability_score);
    } else if (Object.keys(option)[0].includes('category')) {
      //if it try to not do this multiple times there are race conditions
      let optionObject = option[Object.keys(option)[0]];
      optionSet.header = optionObject.name;
      promises.push(
        axios.get(optionObject.url).then(cat => {
          optionSet.options = cat.data.results;
        })
      );
    } else if (Object.keys(option)[0].includes('option')) {
      let thekey = Object.keys(option)[0];
      let optionObject = option[thekey];
      if (key.includes('category')) {
        optionObject.header = optionObject.from[thekey].name;
      }
      optionSet.options.push(optionObject);
    } else if (option['0']) {
      let options = [];
      for (let i = 0; option[i] != undefined; i++) {
        let optionObject;
        optionObject = option[i];
        options.push(optionObject);
      }
      optionSet.options.push(options);
    } else if (option.index.toLowerCase().includes('skill')) {
      let optionName = option.name.substring(option.name.indexOf(':') + 2);
      option.name = optionName;
      let optionObject = option;
      optionSet.options.push(optionObject);
      optionSet.type = 'skill';
    } else {
      let optionObject = option;
      optionSet.options.push(optionObject);
    }
  }
  if (optionSet.header == '') optionSet = null;
  return Promise.all(promises).then(() => {
    return { options: optionSet };
  });
};
const optionsExtractor = async (container, key) => {
  let promises = [];
  let listOfOptions = container[key];
  let allOptions = [];
  let allEquipment = [];

  if (Array.isArray(listOfOptions)) {
    for (let options of listOfOptions) {
      let result;
      if (key.includes('equipment'))
        result = equipmentOptions(container, options, key);
      else result = optionsHelper(container, options, key);
      promises.push(result);
      result.then(res => {
        if (res.options) allOptions.push(res.options);
        else {
          allEquipment.push(res.equipment);
        }
      });
    }
  } else {
    let result;
    if (key.includes('equipment'))
      result = equipmentOptions(container, container[key], key);
    else result = optionsHelper(container, container[key], key);
    promises.push(result);
    result.then(res => {
      if (res.options) allOptions.push(res.options);
      else allEquipment.push(res.equipment);
    });
  }
  return Promise.all(promises).then(() => {
    return { options: allOptions, equipment: allEquipment };
  });
};

const descriptionAdder = async (container, key) => {
  let promises = [];
  for (let item of container[key]) {
    promises.push(
      axios
        .get(item.url) //get description for given option
        .then(details => {
          details = details.data;
          let deets;
          if (details.desc) {
            deets = details.desc;
          } else deets = placeholderDescription;
          item.desc = deets;
          if (details.table) item.table = details.table;
          return;
        })
        .catch(err => console.error(err))
    );
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
    promises.push(
      axios
        .get(proficiency.url)
        .then(profDetails => {
          profDetails = profDetails.data;
          if (key.includes('language')) {
            type = 'Languages';
          } else if (profDetails.type == undefined) {
            type = 'Throws';
          } else if (
            profDetails.type.toLowerCase().includes('tool') ||
            profDetails.type.toLowerCase().includes('other')
          )
            type = 'Tools';
          else type = profDetails.type;
          name = profDetails.name;
          if (name.toLowerCase().includes('skill')) {
            name = name.substring(name.indexOf(':') + 2);
          }
          return;
        })
        .then(() => {
          if (destination[type] == undefined) {
            destination[type] = [];
            destination[type].push(name);
          } else destination[type].push(name);
          dest.profCount = 1;
          return;
        })
    );
  }
  return Promise.all(promises);
};

const propogateSubracePointer = async (subrace, raceContainer) => {
  const promises = [];

  Object.keys(subrace).forEach(key => {
    if (
      key.toLowerCase().includes('option') ||
      key.toLowerCase().includes('choice')
    ) {
      promises.push(
        optionsExtractor(subrace, key).then(options => {
          raceContainer.options = raceContainer.options.concat(options.options);
          raceContainer.equipment_options = raceContainer.equipment_options.concat(
            options.equipment
          );
        })
      );
    } else if (key.toLowerCase().includes('trait')) {
      promises.push(descriptionAdder(subrace, key).then());
    } else if (
      key.toLowerCase().includes('proficienc') ||
      key.toLowerCase().includes('saving_throw') ||
      (key.toLowerCase().includes('language') &&
        !key.toLowerCase().includes('_desc'))
    ) {
      promises.push(proficiencySorter(subrace, key, raceContainer).then());
    } else if (key.toLowerCase().includes('ability')) {
      for (let score of subrace[key]) {
        // console.log(score.ability_score);
        score.ability_score.full_name = fullAbScore[score.ability_score.name];
      }
    }
  });
  return Promise.all(promises).then(() => {
      raceContainer.sub = subrace;
  });
};

const getRaceMiscDescriptions = async race => {
  let promises = [];
  //console.log(race.options);
  for (optionSet of race.options) {
    //console.log(optionSet);
    optionSet.options.forEach(option => {
      if (!option.hasOwnProperty('url')) {
        return;
      }
      promises.push(
        axios
          .get(option.url)
          .then(optionDetails => {
            optionDetails = optionDetails.data;
            if (optionDetails.desc) option.desc = optionDetails.desc;
            else option.desc = placeholderDescription;
          })
          .catch(err => console.error(err))
      );
    });
  }
  return Promise.all(promises).then(() => {
    return race;
  });
};

const propogateRacePointer = async racePointer => {
  console.log(racePointer);
  const promises = [];
  const raceContainer = {
    options: [],
    profCount: 0,
    proficiencies: {
      Armor: [],
      Weapons: [],
      Tools: [],
      Languages: [],
      Throws: [],
    },
    main: {},
    sub: {},
    equipment_options: [],
  };
  const race = (await axios.get(racePointer.url)).data;

  const subrace = racePointer.subrace
    ? (await axios.get(racePointer.subrace.url)).data
    : null;
  if (subrace) promises.push(propogateSubracePointer(subrace, raceContainer));

  Object.keys(race).forEach(key => {
    if (
      key.toLowerCase().includes('option') ||
      key.toLowerCase().includes('choice')
    ) {
      promises.push(
        optionsExtractor(race, key).then(options => {
          raceContainer.options = raceContainer.options.concat(options.options);
          raceContainer.equipment_options = raceContainer.equipment_options.concat(
            options.equipment
          );
        })
      );
    } else if (key.toLowerCase().includes('trait')) {
      promises.push(descriptionAdder(race, key).then());
    } else if (
      key.toLowerCase().includes('proficienc') ||
      key.toLowerCase().includes('saving_throw') ||
      (key.toLowerCase().includes('language') &&
        !key.toLowerCase().includes('_desc'))
    ) {
      //console.log(raceContainer.main);
      promises.push(proficiencySorter(race, key, raceContainer).then());
    } else if (key.toLowerCase().includes('ability')) {
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

const classCaller = async classPointer => {
  const promises = [];
  const classContainer = {
    options: [],
    proficiencies: {
      Armor: [],
      Weapons: [],
      Tools: [],
      Languages: [],
      Throws: [],
    },
    features: [],
    profCount: 0,
    main: {},
    levels: [],
    equipment_options: [],
    spellcasting: null,
    subclass: null,
  };
  const theClass = (await axios.get(classPointer.url)).data; //fetch class
  Object.keys(theClass).forEach(key => {
    if (
      key.toLowerCase().includes('option') ||
      key.toLowerCase().includes('choice')
    ) {
      //console.log(key);
      promises.push(
        optionsExtractor(theClass, key).then(optionSet => {
          classContainer.options = classContainer.options.concat(
            optionSet.options
          );
          classContainer.equipment_options = classContainer.equipment_options.concat(
            optionSet.equipment
          );
        })
      );
    } else if (
      key.toLowerCase().includes('proficienc') ||
      key.toLowerCase().includes('saving_throw') ||
      (key.toLowerCase().includes('language') &&
        !key.toLowerCase().includes('_desc'))
    ) {
      promises.push(proficiencySorter(theClass, key, classContainer).then());
    }
  });
  if (theClass.spellcasting != undefined) {
    if (classContainer.spellcasting == null) classContainer.spellcasting = {};
    classContainer.spellcasting.level = theClass.spellcasting.level;
  }
  if (theClass.subclasses[0].level <= 1) {
    if (classContainer.subclass == null) classContainer.subclass = {};
    for (let subclass of theClass.subclasses[0].subclass_options) {
      classContainer.subclass.name = subclass.name;
      classContainer.subclass.flavor = subclass.subclass_flavor;
      if (!classContainer.subclass.subclass_spells)
        classContainer.subclass.subclass_spells = [];
      if (!classContainer.subclass.subclass_options)
        classContainer.subclass.subclass_options = [];
      if (!classContainer.subclass.subclass_features)
        classContainer.subclass.subclass_features = [];

      promises.push(
        axios.get(subclass.url).then(deets => {
          let details = deets.data;
          if (details.spells != undefined) {
            if (classContainer.spellcasting == null)
              classContainer.spellcasting = {};
            for (let spell of details.spells) {
              if (spell.prerequisites[0].index.includes('1'))
                classContainer.subclass.subclass_spells.push(spell.spell);
            }
          }
          const morePromises = [];
          morePromises.push(
            axios.get(`${details.subclass_levels}/1`).then(deets => {
              const moremorepromises = [];
              let details = deets.data;
              if (details.feature_choices.length > 0) {
                if (!classContainer.subclass.subclass_options)
                  classContainer.subclass.subclass_options = [];
                for (let set of details.feature_choices) {
                  //console.log(set);
                  moremorepromises.push(
                    axios.get(set.url).then(choice => {
                      //console.log(choice.data);
                      moremorepromises.push(
                        optionsExtractor(choice.data, 'choice').then(
                          choiceSet => {
                            classContainer.subclass.subclass_options = classContainer.subclass.subclass_options.concat(
                              choiceSet.options
                            );
                          }
                        )
                      );
                      classContainer.subclass.subclass_features = classContainer.subclass.subclass_features.concat(
                        choice.data
                      );
                    })
                  );
                }
              }
              if (details.features.length > 0) {
                for (let feature of details.features) {
                  moremorepromises.push(
                    axios.get(feature.url).then(feet => {
                      classContainer.subclass.subclass_features.push(feet.data);
                    })
                  );
                }
              }
              return Promise.all(moremorepromises);
            })
          );
          return Promise.all(morePromises);
        })
      );
    }
  }

  let featureURL = `${theClass.class_levels}/1`;
  promises.push(
    axios.get(featureURL).then(details => {
      const morePromises = [];
      details = details.data;
      if (details.feature_choices.length > 0) {
        for (let set of details.feature_choices) {
          //console.log(set);
          axios.get(set.url).then(choice => {
            //console.log(choice.data);
            morePromises.push(
              optionsExtractor(choice.data, 'choice').then(choiceSet => {
                classContainer.options = classContainer.options.concat(
                  choiceSet.options
                );
              })
            );
            classContainer.features = classContainer.features.concat(
              choice.data
            );
          });
        }
      }
      if (classContainer.spellcasting?.level <= 1) {
        for (key in details.spellcasting) {
          if (details.spellcasting[key] == 0) break;
          classContainer.spellcasting[key] = details.spellcasting[key];
        }
      }
      if (details.features.length > 0) {
        classContainer.features = details.features;
        morePromises.push(descriptionAdder(classContainer, 'features').then());
      }
      return Promise.all(morePromises);
    })
  );

  return Promise.all(promises)
    .then(() => {
      classContainer.main = theClass;
      return classContainer;
    })
    .catch(err => console.log(err));
};

const getClassDescriptions = async theClass => {
  let promises = [];
  for (let optionSet of theClass.options) {
    optionSet.options.forEach(option => {
      if (!option.hasOwnProperty('url')) {
        return;
      }
      promises.push(
        axios
          .get(option.url)
          .then(optionDetails => {
            optionDetails = optionDetails.data;
            if (optionDetails.desc) option.desc = optionDetails.desc;
            else option.desc = placeholderDescription;
          })
          .catch(err => console.error(err))
      );
    });
  }
  for (let optionSet of theClass.subclass.subclass_options) {
    optionSet.options.forEach(option => {
      if (!option.hasOwnProperty('url')) {
        return;
      }
      promises.push(
        axios
          .get(option.url)
          .then(optionDetails => {
            optionDetails = optionDetails.data;
            if (optionDetails.desc) option.desc = optionDetails.desc;
            else option.desc = placeholderDescription;
          })
          .catch(err => console.error(err))
      );
    });
  }
  return Promise.all(promises).then(() => {
    return theClass;
  });
};

const getBackgroundList = async () => {
  var backgrounds = [];

  let backgroundPointerList = await axios.get('/api/backgrounds'); //fetch the list of backgrounds
  let backgroundList = backgroundPointerList.data.results;
};

const backgroundCaller = async url => {
  const promises = [];
  let container = {
    profCount: 0,
    proficiencies: {
      Armor: [],
      Weapons: [],
      Tools: [],
      Languages: [],
      Throws: [],
    },
    options: [],
    equipment_options: [],
  };

  const background = (await axios.get(url)).data;
  Object.keys(background).some(key => {
    if (
      key.toLowerCase().includes('option') ||
      key.toLowerCase().includes('choice')
    ) {
      //console.log(key);
      promises.push(
        optionsExtractor(background, key).then(optionSet => {
          container.options = container.options.concat(optionSet.options);
          container.equipment_options = container.equipment_options.concat(
            optionSet.equipment
          );
        })
      );
    } else if (
      key.toLowerCase().includes('proficienc') ||
      key.toLowerCase().includes('saving_throw')
    ) {
      promises.push(proficiencySorter(background, key, container).then());
    }
    return key === 'feature'; //for now, stops execution before the personality tables, etc
  });
  return Promise.all(promises).then(() => {
    container = {
      ...background,
      ...container,
    };
    return container;
  });
};

const getAlignments = async () => {
  axios.get('/api/alignments').then(alignments => {
    return alignments.data.results;
  });
};

const equipmentDetails = async equipment => {
  const promises = [];
  let result;
  if (equipment[0]?.equipment) {
    result = equipment.map(theItem => {
      if(theItem.category && theItem.category == 'currency') {
          return {
              equipment: {
                ...theItem,
              name: `${theItem.quantity} ${theItem.unit}`
              },
              quantity: 1
          }
      }
      let item = theItem;
      if (item.equipment.hasOwnProperty('url')) {
        promises.push(
          axios.get(item.equipment.url).then(itemDetails => {
            itemDetails = itemDetails.data;
            makeEquipmentDesc(item, itemDetails).then(desc => {
              item.equipment.desc = desc;
            });
            return item;
          })
        );
      } else if (Array.isArray(item)) {
        item.map(i => {
          promises.push(
            axios.get(i.url).then(itemDetails => {
              itemDetails = itemDetails.data;
              makeEquipmentDesc(i, itemDetails).then(desc => {
                i.desc = desc;
              });
              return i;
            })
          );
        });
      } else {
        console.error(
          "equipment details caller hasn't caught something in",
          item
        );
      }
      return item;
    });
  }
  else if(equipment[0]?.item) {
      result = equipment.map(item => {
          if(item.item.url != undefined) {
            promises.push(
                axios.get(item.item.url).then(itemDetails => {
                  itemDetails = itemDetails.data;
                  makeEquipmentDesc(item, itemDetails).then(desc => {
                    item.item.desc = desc;
                  });
                  return item;
                })
              );
          }
          return item;
      })
  }
  else {
    result = equipment.map(theItem => {
      theItem.from = theItem.from.map(item => {
        if (item.hasOwnProperty('url')) {
          promises.push(
            axios.get(item.url).then(itemDetails => {
              itemDetails = itemDetails.data;
              makeEquipmentDesc(item, itemDetails).then(desc => {
                item.desc = desc;
              });
              return item;
            })
          );
        } else if (item.hasOwnProperty('choose')) {
          let option = item.from.equipment_category;
          promises.push(
            axios
              .get(option.url)
              .then(cat => {
                item.from = cat.data.equipment;
                return item.from;
              })
              .then(options => {
                options = options.map(the => {
                  promises.push(
                    axios.get(the.url).then(itemDetails => {
                      itemDetails = itemDetails.data;
                      makeEquipmentDesc(the, itemDetails).then(desc => {
                        the.desc = desc;
                      });
                      return the;
                    })
                  );
                });
                return options;
              })
          );
        } else if (Array.isArray(item)) {
          item.map(item => {
            if (item.hasOwnProperty('url')) {
              promises.push(
                axios.get(item.url).then(itemDetails => {
                  itemDetails = itemDetails.data;
                  makeEquipmentDesc(item, itemDetails).then(desc => {
                    item.desc = desc;
                  });
                  return item;
                })
              );
            } else if (item.hasOwnProperty('choose')) {
              let option = item.from.equipment_category;
              promises.push(
                axios
                  .get(option.url)
                  .then(cat => {
                    item.from = cat.data.equipment;
                    return item.from;
                  })
                  .then(options => {
                    options = options.map(the => {
                      promises.push(
                        axios.get(the.url).then(itemDetails => {
                          itemDetails = itemDetails.data;
                          makeEquipmentDesc(the, itemDetails).then(desc => {
                            the.desc = desc;
                          });
                          return the;
                        })
                      );
                    });
                    return options;
                  })
              );
            }
          });
        } else {
          console.error(
            "equipment details caller hasn't caught something in",
            item
          );
        }
        return item;
      });
      return theItem;
    });
  }
  return Promise.all(promises).then(() => {
    return result;
  });
};

const getSpellCards = async (levels, url, subclassSpells) => {
  const promises = [];
  const lists = [];
  const spells = {};
  for (let level of levels) {
    promises.push(
      axios.get(`${url}${level}/spells`).then(spellList => {
        spellList = spellList.data.results.concat(subclassSpells);
        const morePromises = [];
        for (let spell of spellList) {
          morePromises.push(
            axios.get(spell.url).then(spellDetails => {
              spellDetails = spellDetails.data;
              if (level == 0) {
                if (spells.cantrips == undefined) spells.cantrips = [];
                spells.cantrips.push(spellDetails);
              } else {
                if (spells[`level${level}`] == undefined)
                  spells[`level${level}`] = [];
                spells[`level${level}`].push(spellDetails);
              }
            })
          );
        }
        return Promise.all(morePromises);
      })
    );
  }
  return Promise.all(promises).then(() => {
    return spells;
  });
  /*somehow even slower: 
    for(let level of levels) {
        levelObj = {level: level};
        lists.push(axios.get(`${url}${level}/spells`).then((list) => {
            let data = {
                list: list.data.results,
                level: level
            }
            return (data)
        }));
    }
    return Promise.all(lists).then((lists) => {
        console.log(lists);
        for(let list of lists) {
            for(let spell of list.list) {
                console.log(spell);
                promises.push(axios.get(spell.url).then((spellDetails) => {
                    spellDetails = spellDetails.data;
                    if(list.level == 0) {
                        if(spells.cantrips == undefined) spells.cantrips = [];
                        spells.cantrips.push(spellDetails);
                    }
                    else {
                        if(spells[`level${list.level}`] == undefined) spells[`level${list.level}`] = [];
                        spells[`level${list.level}`].push(spellDetails);
                    }
                }))                
            }
        }
        return Promise.all(promises).then(()=> {
            return spells;
        })
    })*/
};
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

module.exports = {
  classCaller,
  backgroundCaller,
  propogateRacePointer,
  getRaceMiscDescriptions,
  getClassDescriptions,
  equipmentDetails,
  getSpellCards,
};
