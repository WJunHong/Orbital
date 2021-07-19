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

//

/* Tasks
{
        "user_id": "EntAuetg2kNXdsDuMR3VUn0O3uk1",
        "todo_id": 1,
        "description": "l",
        "deadline": "2021-07-31T00:00:00.000Z",
        "tododate": "2021-07-23T22:30:00.000Z",
        "todoenddate": "2021-07-23T23:00:00.000Z",
        "priority": 2,
        "progress": 26,
        "properties": [],
        "completed": false,
        "list": null,
        "subtasks": [{
            "subtask_id": 20,
            "description": "Buy drinks for the party",
            "completed": false,
            list": null
        }, ..........]
    }
*/
/* Subtasks
{
        "user_id": "vx8Qsw4Oifbaw1vv0Dertllnn6W2",
        "subtask_id": 20,
        "todo_id": 47,
        "description": "Buy drinks for the party",
        "completed": false,
        "list": null
}
*/

const store = new CustomStore({
  key: "todo_id",
  load: async () => {
    try {
      const user = app.auth().currentUser;
      const user_id = user.uid;
      // Calls the GET all tasks route method
      const response = await fetch("/todos", {
        method: "GET",
        headers: { user_id },
      });
      const tasks = await response.json();
      const res = await fetch("/subtasks/", {
        method: "GET",
        headers: { user_id },
      });
      const _subtasks = await res.json();
      const newTasks = tasks.map((task) => {
        const obj = {
          ...task,
          subtasks: _subtasks
            .filter((i) => i[0] === task.todo_id)
            .map((i) => i[1]),
        };
        return obj;
      });
      console.log(newTasks);
      return newTasks;
    } catch (err) {
      console.error(err.message);
    }
  },
  insert: async (values) => {
    try {
      const user = app.auth().currentUser;
      const user_id = user.uid;
      const propArr = values.properties || [];
      values = {
        ...values,
        user_id: user_id,
        properties: propArr
      };
      // Calls the GET all tasks route method
      const response = await fetch("/todos", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(values);
    } catch (err) {
      console.error(err.message);
    }
  },
  update: async (key, values) => {
    try {
      const TZOFFSET = 28800000;
      if (values.deadline !== null) {
        var deadlineTime = new Date(values.deadline).getTime();
        var deadline = new Date(deadlineTime - TZOFFSET);
        values.deadline = deadline;
      }
      if (values.tododate !== null) {
        var todoTodoTime = new Date(values.tododate).getTime();
        var todoTodoDate = new Date(todoTodoTime - TZOFFSET);
        values.tododate = todoTodoDate;
      }
      if (values.todoenddate !== null) {
        var todoTodoEndTime = new Date(values.todoenddate).getTime();
        var todoTodoEndDate = new Date(todoTodoEndTime - TZOFFSET);
        values.todoenddate = todoTodoEndDate;
      }
      const response = await fetch(`/todos/${key}`, {
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
      const response = await fetch(`/todos/${key}`, {
        method: "DELETE",
      });
      const deleteSubtasks = await fetch(`/subtasks/${key}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error(err.message);
    }
  },
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
    console.log(data);
    data.popup.option("showTitle", true);
    data.popup.option(
      "title",
      data.appointmentData.text ? data.appointmentData.text : "Edit task"
    );

    const form = data.form;

    form.option("items", [
      {
        editorType: "dxCheckBox",
        dataField: "completed",
        editorOptions: {
          Text: "Completed"

        },
      },
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
        editorOptions: {
          type: "datetime",
          showAnalogClock: false,
          dropDownOptions: {
            position: "right",
          },
        },
      },
      {
        label: {
          text: "Todo Start Date",
        },
        editorType: "dxDateBox",
        dataField: "tododate",
        editorOptions: {
          type: "datetime",
          showAnalogClock: false,
          dropDownOptions: {
            position: "right",
          },
        },
      },
      {
        label: {
          text: "Todo End Date",
        },
        editorType: "dxDateBox",
        dataField: "todoenddate",
        editorOptions: {
          type: "datetime",
          showAnalogClock: false,
          dropDownOptions: {
            position: "right",
          },
        },
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
        dataField: "progress",
        editorOptions: {
          value: data.appointmentData.progress,
        },
      },
      {
        label: {
          text: "Properties",
        },
        editorType: "dxTagBox",
        dataField: "properties",
        editorOptions: {
          dataSource: properties,
        },
      }, 
      data.appointmentData.subtasks.length === 0 ? {} : data.appointmentData.subtasks.map( (subtask) => {
         const option = {
          label: {
            text: "Subtasks",
          },
          editorType: "dxCheckBox",
          editorOptions: {
            text: subtask.description
          }
         };
         return option;
        })
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
          maxAppointmentsPerCell="3"
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
