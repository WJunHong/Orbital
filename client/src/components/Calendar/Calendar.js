import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.dark.css";
import "../../App.css";
import Background from "../Background";
import TabName from "../TabName";
import app from "../../base";
import React, { useState, useCallback } from "react";
import { Scheduler, View, Editing } from "devextreme-react/scheduler";
import CustomStore from "devextreme/data/custom_store";

function handleErrors(response) {
  if (!response.ok) throw Error(response.statusText);
  return response;
}

const url = "http://localhost:5000";

const store = new CustomStore({
  key: 'todo_id',
  load: async () => {
    try {
      const user = app.auth().currentUser;
      const user_id = user.uid;
      // Calls the GET all tasks route method
      const response = await fetch(`${url}/todos`, {
        method: "GET",
        headers: { user_id },
      });
      const jsonData = await response.json();
      return jsonData;
    } catch (err) {
      console.error(err.message);
    }
  },
  insert: async (values) => {
    try {
      const user = app.auth().currentUser;
      const user_id = user.uid;
      // Calls the GET all tasks route method
      const response = await fetch(`${url}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
         },
      });
    } catch (err) {
      console.error(err.message);
    }
  },
  update: async (key, values) => {
    try {
      const response = await fetch(`${url}/todos/${key}`, {
        method: "PUT",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error(err.message);

    }
  },
  remove: async (key) => {
    try {
      const response = await fetch(`${url}/todos/${key}`, {
        method: "DELETE",
      });
      const deleteSubtasks = await fetch(`/subtasks/${key}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error(err.message)
    }
  }
});

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [properties, setProperties] = useState([]);

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

  const onAppointmentFormOpening = (data) => {
    data.popup.option("showTitle", true);
    data.popup.option(
      "title",
      data.appointmentData.text ? data.appointmentData.text : "Edit task"
    );

    const form = data.form;

    form.option("items", [
      {
        label: {
          text: "Description",
        },
        editorType: "dxTextBox",
        dataField: "description",
        editorOptions: {},
      },
      {
        label: {
          text: "Deadline",
        },
        editorType: "dxDateBox",
        dataField: "deadline",
      },
      {
        label: {
          text: "Todo Start Date",
        },
        editorType: "dxDateBox",
        dataField: "tododate",
      },
      {
        label: {
          text: "Todo End Date",
        },
        editorType: "dxDateBox",
        dataField: "todoenddate",
      },
      {
        label: {
          text: "Priority",
        },
        editorType: "dxSelectBox",
        dataField: "priority",
        editorOptions: {
          items: [1, 2, 3, 4, 5],
        },
      },
      {
        label: {
          text: "Progress",
        },
        editorType: "dxSlider",
        editorOptions: {
          value: data.progress,
        },
      },
      {
        label: {
          text: "Properties",
        },
        editorType: "dxTagBox",
        dataField: "properties",
        editorOptions: {
          items: data.properties,
          dataSource: properties,
        },
      },
    ]);
  };

  const handlePropertyChange = useCallback((e) => {
    if (e.name === "currentDate") {
      setCurrentDate(e.value);
    }
  }, []);

  return (
    <Background>
      <TabName name={"Calendar"} />
      <div className="calendarStyle">
        <Scheduler
          id="scheduler"
          dataSource={store}
          textExpr="description"
          startDateExpr="tododate"
          endDateExpr="todoenddate"
          allDayExpr="dayLong"
          recurrenceRuleExpr="recurrence"
          currentDate={currentDate}
          onOptionChanged={handlePropertyChange}
          onAppointmentRendered={getProperties}
          width={1000}
          height={window.innerHeight - 250}
          defaultCurrentView="month"
          timeZone="UTC"
          adaptivityEnabled={true}
          maxAppointmentsPerCell="auto"
          onAppointmentFormOpening={onAppointmentFormOpening}
        >
          <View type="day" startDayHour={0} endDayHour={24} />
          <View type="week" startDayHour={0} endDayHour={24} />
          <View type="month" />
          <Editing allowTimeZoneEditing={true} allowDragging={true} />
        </Scheduler>
      </div>
    </Background>
  );
}

export default Calendar;
