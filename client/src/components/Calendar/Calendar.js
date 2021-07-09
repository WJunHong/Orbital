import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.dark.css";
import "../../App.css";
import Background from "../Background";
import TabName from "../TabName";
import app from "../../base";
import React, { useEffect, useState, useCallback } from "react";

import { Scheduler, View, Editing } from "devextreme-react/scheduler";
//import { appointments } from "./data.js";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [todos, setTodos] = useState([]);

  const getTodos = async () => {
    try {
      const user = app.auth().currentUser;
      const user_id = user.uid;
      // Calls the GET all tasks route method
      const response = await fetch("/todos", {
        method: "GET",
        headers: { user_id },
      });
      const jsonData = await response.json();
      const arr = jsonData.map((todo) => {
        return {
          title: todo.description,
          startDate: new Date("2021-07-23T08:45:00.000Z"),
          endDate: new Date("2021-07-23T09:45:00.000Z"),
        };
      });
      setTodos(arr);
    } catch (err) {
      console.error(err.message);
    }
  };

  const onAppointmentFormOpening = (e) => {
    e.popup.option("showTitle", true);
    e.popup.option(
      "title",
      e.appointmentData.text ? e.appointmentData.text : "Edit task"
    );

    const form = e.form;
    let mainGroupItems = form.itemOption("mainGroup").items;
    console.log(mainGroupItems);
    if (
      !mainGroupItems.find(function (i) {
        return i.dataField === "phone";
      })
    ) {
      mainGroupItems.push({
        colSpan: 2,
        label: { text: "Phone Number" },
        editorType: "dxTextBox",
        dataField: "phone",
      });
      form.itemOption("mainGroup", "items", mainGroupItems);
    }

    let formItems = form.option("items");
    if (
      !formItems.find(function (i) {
        return i.dataField === "location";
      })
    ) {
      formItems.push({
        colSpan: 2,
        label: { text: "Location" },
        editorType: "dxTextBox",
        dataField: "location",
      });
      form.option("items", formItems);
    }
  };

  const handlePropertyChange = useCallback((e) => {
    if (e.name === "currentDate") {
      setCurrentDate(e.value);
    }
  }, []);
  useEffect(() => getTodos(), [todos]);
  return (
    <Background>
      <TabName name={"Calendar"} />
      <div className="calendarStyle">
        <Scheduler
          id="scheduler"
          dataSource={todos}
          textExpr="title"
          allDayExpr="dayLong"
          recurrenceRuleExpr="recurrence"
          currentDate={currentDate}
          onOptionChanged={handlePropertyChange}
          width={1000}
          height={window.innerHeight - 250}
          defaultCurrentView="month"
          timeZone="Singapore"
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
