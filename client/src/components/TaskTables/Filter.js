import React, { useState, Fragment, useEffect } from "react";
import app from "../../base";

const Filter = ({name, todos}) => {
  const filterObj = localStorage.getItem(`filter-${name}`);
  const initialSelectedProperties = filterObj == null ? [] : JSON.parse(filterObj).properties; // user properties to be fetched from database
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState(initialSelectedProperties);

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

  const handleSelectProperties = (property) => {
    const isSelected = selectedProperties.includes(property);

    var newSelection = null;
    if (isSelected) {
      newSelection = selectedProperties.filter(currProperty => currProperty != property);
    } else {
      newSelection = [...selectedProperties, property];
    }
    setSelectedProperties(newSelection);
    const filterObj = {
      priority: [],
      deadline: [null, null],
      progress: [0, 100],
      todoDate: [null, null],
      properties: newSelection
    };
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
        <div className="Filter-Checkbox">
          {properties.map((property, index) => {
            const isSelected = selectedProperties.includes(property);
            return (
              <Fragment>
                <input name={`property-${index}`} key={index} type="checkbox" checked={isSelected} onChange={() => handleSelectProperties(property)}>
                </input>
                <label htmlFor={`property-${index}`} style={{color: "white"}}>{property}</label> 
              </Fragment>
            );
          })
          }
        </div>
    </Fragment>
  );
}

export default Filter;
