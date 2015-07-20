var Calendar = function () {

  /* Private Constants */
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function getMonthName(m) {
    return monthNames[m];
  }

  /* Private Functions */
  function isLeap(y) {
    if (y % 4 === 0 && y % 100 !== 0) {
      return true;
    }
    else if (y % 400 === 0) {
      return true;
    }
    return false;
  }

  /* Public Functions */
  function getCalendarForMonth(d) {
    date = new Date(d); 
    date.setDate(1);

    var month = date.getMonth();
    var first = date.getDay();
    var dates = [];

    switch(month) {
      case 0:
      case 2:
      case 4:
      case 6:
      case 7:
      case 9:
      case 11:
        limit = 32;
        break;
      case 3:
      case 5:
      case 8:
      case 10:
        limit = 31;
        break;
      case 1:
        if (isLeap(date.getFullYear)) { limit = 29; }
        else { limit = 28; }
        break;
    }

    counter = 1;
    for (var i=0; i<42; i++) {
      if (i >= first && counter < limit) {
        dates[i] = new Date(date.setDate(counter));
        counter++;
      }
      else {
        if (i < first) {
          dates[i] = null;
        }
      }
    }
    return dates;
  }

  
  return {
    days: dayNames,
    month: getMonthName,
    dates: getCalendarForMonth,
  };

}();

var date = new Date();
var today = new Date();

var DatePickerBox = React.createClass({displayName: "DatePickerBox",
  getInitialState: function () {
    return {
      today: today,
      date: date,
      days: Calendar.days,
      month: Calendar.month(date.getMonth()),
      dates: Calendar.dates(date), 
      selected: today,
    };
  },
  onSelect: function(e) {
    this.setState({ selected: new Date(e.target.value) });
  },
  onNext: function () {
    this.state.date.setMonth(this.state.date.getMonth()+1);
    this.setState({
      month: Calendar.month(this.state.date.getMonth()),
      dates: Calendar.dates(this.state.date),
    });
  },
  onPrev: function () {
    this.state.date.setMonth(this.state.date.getMonth()-1);
    this.setState({
      month: Calendar.month(this.state.date.getMonth()),
      dates: Calendar.dates(this.state.date),
    });
  },
  render: function () {
    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "date-picker"}, 
          React.createElement(MonthBox, {month: this.state.month, onNext: this.onNext, onPrev: this.onPrev}), 
          React.createElement(DayBox, {days: this.state.days}), 
          React.createElement(DateBox, {dates: this.state.dates, today: this.state.today, onSelect: this.onSelect})
        ), 
        React.createElement(SelectedBox, {selected: this.state.selected})
      )
    );
  }
});

var MonthBox = React.createClass({displayName: "MonthBox",
  handleNext: function (e) {
    this.props.onNext();
  },
  handlePrev: function () {
    this.props.onPrev();
  },
  render: function () {
    return (
      React.createElement("div", {className: "month-box"}, 
        React.createElement("h3", {className: "arrow", onClick: this.handlePrev}, React.createElement("i", {className: "fa fa-chevron-left"})), 
        React.createElement("h3", {className: "month"}, this.props.month), 
        React.createElement("h3", {className: "arrow", onClick: this.handleNext}, React.createElement("i", {className: "fa fa-chevron-right"}))
      )
    );
  }
});

var DayBox = React.createClass({displayName: "DayBox",
  render: function () {
    var dayNode = this.props.days.map(function (day, index) {
      return (
        React.createElement("div", {className: "day", key: index}, 
          React.createElement("p", null, day)
        )
      );
    });
    return (
      React.createElement("div", {className: "day-box"}, 
        dayNode
      )
    );
  }
});

var DateBox = React.createClass({displayName: "DateBox",
  handleSelect: function (e) {
    console.log('clicked');
    this.props.onSelect(e);
  },
  render: function () {
    var today = this.props.today;
    var handleSelect = this.handleSelect;
    var dateNode = this.props.dates.map(function (date, index) {
      if (date) {
        return (
          React.createElement("div", {className: "date", key: index}, 
            React.createElement("button", {onClick: handleSelect, 
            className: date.toDateString() === today.toDateString() ? 'today-button': 'date-button', 
            value: date}, date.getDate()
            )
          )
        );
      }
      else {
        return (
          React.createElement("div", {className: "date", key: index}, 
            React.createElement("button", {className: "date-button"}, " ")
          )
        );
      }
    });
    return (
      React.createElement("div", {className: "date-box"}, 
        dateNode
      )
    );
  }
});

var SelectedBox = React.createClass({displayName: "SelectedBox",
  render: function () {
    return (
      React.createElement("div", {className: "selected"}, 
        React.createElement("p", null, this.props.selected.toDateString())
      )
    );
  }
});

React.render(
  React.createElement(DatePickerBox, null), document.getElementById('datepicker')
);
