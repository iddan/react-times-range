import React, { Component } from "react";
import { Typography } from "@rmwc/typography";
import { Ripple } from "@rmwc/ripple";

const getMonthName = index => {
  var date = new Date();
  date.setMonth(index);
  return date.toLocaleString([], { month: "long" });
};

const getDaysInMonth = (monthNumber, yearNumber) =>
  new Date(yearNumber, monthNumber, 0).getDate();

const getFirstDayInTheWeekOfMonth = (monthNumber, yearNumber) =>
  new Date(yearNumber, monthNumber - 1, 1).getDay();

const daysOfTheWeek = ["S", "M", "T", "W", "T", "F", "S"];

const last = array => array[array.length - 1];
// const dayOfTheWeek = (firstDayWeekOffset + index) % daysOfTheWeek.length;

class Day extends Component {
  handleClick = () => {
    this.props.onClick(this.props.index);
  };

  render() {
    const { index, selected } = this.props;
    return (
      <Ripple unbounded primary>
        <Typography
          use="body1"
          className={["day", selected && "selected"].filter(Boolean).join(" ")}
          onClick={this.handleClick}
        >
          {index + 1}
        </Typography>
      </Ripple>
    );
  }
}

export default class Month extends Component {
  props: { year: number, index: number };

  handleDayClick = day => {
    this.props.onDayClick({
      day,
      month: this.props.index,
      year: this.props.year
    });
  };

  render() {
    const { index, year, onDayClick, selected } = this.props;
    const name = getMonthName(index);
    const days = getDaysInMonth(year, index);
    const firstDayWeekOffset = getFirstDayInTheWeekOfMonth(year, index + 1);

    const dayNodes = Array(days)
      .fill(1)
      .map((_, index) => {
        return (
          <Day
            key={index}
            index={index}
            onClick={this.handleDayClick}
            selected={
              selected &&
              index === selected.day &&
              this.props.index === selected.month &&
              this.props.year === selected.year
            }
          />
        );
      });

    const dayNodesByWeek = dayNodes.reduce((byWeek, node) => {
      if (
        byWeek.length === 0 ||
        (byWeek.length === 1 &&
          last(byWeek).length === daysOfTheWeek.length - firstDayWeekOffset) ||
        last(byWeek).length === daysOfTheWeek.length
      ) {
        byWeek.push([]);
      }
      const week = last(byWeek);
      week.push(node);
      return byWeek;
    }, []);

    return (
      <div className="Month">
        <Typography className="name" use="body1">
          {name}
        </Typography>
        <div className="weekday-labels">
          {daysOfTheWeek.map((day, index) => (
            <Typography key={index} className="weekday-label" use="body1">
              {day}
            </Typography>
          ))}
        </div>
        {dayNodesByWeek.map((dayNodes, index) => (
          <div
            key={index}
            className={["week", index === 0 && "first"]
              .filter(Boolean)
              .join(" ")}
          >
            {dayNodes}
          </div>
        ))}
      </div>
    );
  }
}
