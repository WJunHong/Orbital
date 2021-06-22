import React, { useState, Fragment, useEffect } from "react";
import app from "../../base";

const Filter = ({name, todos}) => {
  const filterObj = localStorage.getItem(`filter-${name}`);

  const initialSelectedProperties = filterObj == null ? [] : JSON.parse(filterObj).properties; // user properties to be fetched from database
  const initialSelectedPriorities = filterObj == null ? [] : JSON.parse(filterObj).priority;
  const initialSelectedDeadline = filterObj == null ? [null, null] : JSON.parse(filterObj).deadline;
  const initialSelectedProgress = filterObj == null ? [0, 100] : JSON.parse(filterObj).progress;
  const initialSelectedToDoDate = filterObj == null ? [null, null] : JSON.parse(filterObj).todoDate;

  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState(initialSelectedProperties);
  const priority = [1,2,3,4,5];
  const [selectedPriorities, setSelectedPriorities] = useState(initialSelectedPriorities);

  const getProperties = async () => {
    try {
      const user = app.auth().currentUser;
      const user_id = user.uid;
      // Calls the GET all properties route method
      const response = await fetch("/filter/properties", {
        method: "GET",
        headers: { user_id },
      });
      const jsonData = await response.json();
      const { unique_properties } = jsonData;
      if (unique_properties !== null) {
        setProperties(unique_properties);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSelect = (str, property, arr, set) => {
    const isSelected = arr.includes(property);

    var newSelection = null;
    if (str == "priority" || str == "property") {
      if (isSelected) {
        newSelection = arr.filter(currProperty => currProperty != property);
      } else {
        newSelection = [...arr, property];
      }
    }
    set(newSelection);
    var filterObj;
    switch(str) {
      case "priority":
        filterObj = {
          priority: newSelection,
          deadline: [null, null],
          progress: [0, 100],
          todoDate: [null, null],
          properties: selectedProperties
        };
        break;
      // case "deadline":
      
      // case "progress":
      
      // case "todoDate":

      case "property":
        filterObj = {
          priority: selectedPriorities,
          deadline: [null, null],
          progress: [0, 100],
          todoDate: [null, null],
          properties: newSelection
        };
    }
    localStorage.setItem(`filter-${name}`, JSON.stringify(filterObj));
  };

  useEffect(() => 
    getProperties(), 
    [todos]
  );

  return (
    <Fragment>
      <div className="Filter"></div>
        <h3 style={{color: "white"}}>Filter</h3>
        <form>
        <div className="Filter-Priorities" style={{color: "white"}}>
          Priorities: 
          {priority.map((property, index) => {
            const isSelected = selectedPriorities.includes(property);
            return (
              <Fragment>
                <input name={`priority-${index}`} key={index} type="checkbox" checked={isSelected} onChange={() => handleSelect("priority", property, selectedPriorities, setSelectedPriorities)}>
                </input>
                <label htmlFor={`priority-${index}`} style={{color: "white"}}>{property}</label> 
              </Fragment>
            );
          })
          }
        </div>
        <div className="Filter-Progress" style={{color: "white"}}>
              <Fragment>
                <label htmlFor="progress" style={{color: "white"}}>Progress: </label>
                <input name="progress-first" id="progress-first" type="number" min="0" max="100"></input> {" - "}
                <input name="progress-second" type="number" min={"0"} max="100"></input>
              </Fragment>
        </div>
        <div className="Filter-Properties" style={{color: "white"}}>
          Properties: 
          {properties.map((property, index) => {
            const isSelected = selectedProperties.includes(property);
            return (
              <Fragment>
                <input name={`property-${index}`} key={index} type="checkbox" checked={isSelected} onChange={() => handleSelect("property", property, selectedProperties, setSelectedProperties)}>
                </input>
                <label htmlFor={`property-${index}`} style={{color: "white"}}>{property}</label> 
              </Fragment>
            );
          })
          }
        </div>
        </form>
    </Fragment>
  );
}

export default Filter;
