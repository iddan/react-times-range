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
    const { index, selectedStart, selectedEnd, inRange } = this.props;
    return (
      <Ripple unbounded primary>
        <Typography
          use="body1"
          className={[
            "day",
            selectedStart && "selected-start",
            selectedEnd && "selected-end",
            inRange && "in-range"
          ]
            .filter(Boolean)
            .join(" ")}
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
    const { index, year, startDate, endDate } = this.props;
    const name = getMonthName(index);
    const days = getDaysInMonth(year, index);
    const firstDayWeekOffset = getFirstDayInTheWeekOfMonth(year, index + 1);
    const sdd =
      startDate &&
      new Date(startDate.year, startDate.month + 1, startDate.day + 1);
    const edd =
      endDate && new Date(endDate.year, endDate.month + 1, endDate.day + 1);

    const dayNodes = Array(days)
      .fill(1)
      .map((_, index) => {
        const ddd = new Date(this.props.year, this.props.index + 1, index + 1);
        return (
          <Day
            key={index}
            index={index}
            onClick={this.handleDayClick}
            inRange={sdd && edd && sdd < ddd && ddd < edd}
            selectedStart={
              startDate &&
              index === startDate.day &&
              this.props.index === startDate.month &&
              this.props.year === startDate.year
            }
            selectedEnd={
              endDate &&
              index === endDate.day &&
              this.props.index === endDate.month &&
              this.props.year === endDate.year
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
