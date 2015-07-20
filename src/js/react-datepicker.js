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

var DatePickerBox = React.createClass({
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
      <div>
        <div className='date-picker'>
          <MonthBox month={this.state.month} onNext={this.onNext} onPrev={this.onPrev} />
          <DayBox days={this.state.days} />
          <DateBox dates={this.state.dates} today={this.state.today} onSelect={this.onSelect}/>
        </div>
        <SelectedBox selected={this.state.selected} />
      </div>
    );
  }
});

var MonthBox = React.createClass({
  handleNext: function (e) {
    this.props.onNext();
  },
  handlePrev: function () {
    this.props.onPrev();
  },
  render: function () {
    return (
      <div className='month-box'>
        <h3 className='arrow' onClick={this.handlePrev} ><i className='fa fa-chevron-left'></i></h3>
        <h3 className='month'>{this.props.month}</h3>
        <h3 className='arrow' onClick={this.handleNext} ><i className='fa fa-chevron-right'></i></h3>
      </div>
    );
  }
});

var DayBox = React.createClass({
  render: function () {
    var dayNode = this.props.days.map(function (day, index) {
      return (
        <div className='day' key={index}>
          <p>{day}</p>
        </div>
      );
    });
    return (
      <div className='day-box'>
        {dayNode}
      </div>
    );
  }
});

var DateBox = React.createClass({
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
          <div className='date' key={index}>
            <button onClick={handleSelect} 
            className={date.toDateString() === today.toDateString() ? 'today-button': 'date-button'}
            value={date}>{date.getDate()} 
            </button>
          </div>
        );
      }
      else {
        return (
          <div className='empty-date' key={index}>
            <button className='date-button'>&nbsp;</button>
          </div>
        );
      }
    });
    return (
      <div className='date-box'>
        {dateNode}
      </div>
    );
  }
});

var SelectedBox = React.createClass({
  render: function () {
    return (
      <div className="selected">
        <p>{this.props.selected.toDateString()}</p>  
      </div>
    );
  }
});

React.render(
  <DatePickerBox />, document.getElementById('datepicker')
);
