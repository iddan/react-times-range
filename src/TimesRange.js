import React, { Component, createRef } from "react";
import { Card } from "@rmwc/card";
import { TextField } from "@rmwc/textfield";
import { Button } from "@rmwc/button";
import { Typography } from "@rmwc/typography";
import { Elevation } from "@rmwc/elevation";
import { Icon } from "@rmwc/icon";
import "@rmwc/icon/icon.css";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/line-ripple/dist/mdc.line-ripple.css";
import "@material/card/dist/mdc.card.css";
import "@material/button/dist/mdc.button.css";
import "@material/typography/dist/mdc.typography.css";
import "@material/elevation/dist/mdc.elevation.css";
import "./TimesRange.css";
import {
  getMonthName,
  getFirstDayInTheWeekOfMonth,
  getDaysInMonth
} from "./util";

/**
 * @todo
 * style flippers
 * make body positioned absolutely so it won't hurt flow
 * add time pickers
 */

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
      <Typography
        use="body1"
        className={["day", selected && "selected"].filter(Boolean).join(" ")}
        onClick={this.handleClick}
      >
        {index + 1}
      </Typography>
    );
  }
}

class Month extends Component {
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

export default class TimesRange extends Component {
  state = {
    open: false,
    displayedMonths: [
      { index: 0, year: new Date().getFullYear() },
      { index: 1, year: new Date().getFullYear() }
    ],
    startDate: null,
    endDate: null
  };

  rootElement: ?DOMElement = null;

  handleGlobalClick = event => {
    if (this.rootElement === null || !this.rootElement.contains(event.target)) {
      this.setState({ open: false });
      document.removeEventListener("click", this.handleGlobalClick);
    }
  };

  handleClick = event => {
    /** @todo make sure this is the only place we handle open */
    if (this.state.open === false) {
      this.rootElement = event.currentTarget;
      document.addEventListener("click", this.handleGlobalClick);
      this.setState({ open: true });
    }
  };

  handleDayClick = day => {
    this.setState(prevState => {
      const { startDate, endDate } = prevState;
      const endDateDate =
        endDate === null
          ? null
          : new Date(endDate.year, endDate.month, endDate.day);
      const date = new Date(day.year, day.month, day.day);

      /** @todo copy logic from Google */
      if (startDate === null || (endDateDate !== null && date < endDateDate)) {
        return { startDate: day };
      }
      if (endDateDate === null || date > endDateDate) {
        return { endDate: day };
      }
    });
  };

  close = () => {
    this.setState({ open: false });
  };

  backwardMonth = () => {
    /**
     * @todo dont assume 12 months a year
     */
    this.setState(prevState => ({
      displayedMonths: prevState.displayedMonths.map(month => ({
        index: month.index === 0 ? 11 : month.index - 1,
        year: month.index === 0 ? month.year - 1 : month.year
      }))
    }));
  };

  forwardMonth = () => {
    this.setState(prevState => ({
      displayedMonths: prevState.displayedMonths.map(month => ({
        index: month.index === 11 ? 0 : month.index + 1,
        year: month.index === 11 ? month.year + 1 : month.year
      }))
    }));
  };

  reset = () => {
    this.setState({
      startDate: null,
      endDate: null
    });
  };

  render() {
    /** @todo make text fields editable */
    return (
      <Card
        className={["TimeRange", this.state.open && "open"]
          .filter(Boolean)
          .join(" ")}
        onClick={this.handleClick}
      >
        <div className="inputs">
          <TextField
            withLeadingIcon="date_range"
            value={
              /** @todo make this date time string */
              this.state.startDate &&
              new Date(
                this.state.startDate.year,
                this.state.startDate.month,
                this.state.startDate.day
              ).toLocaleDateString()
            }
          />
          <div className="field-divider" />
          <TextField
            value={
              /** @todo make this date time string */
              this.state.endDate &&
              new Date(
                this.state.endDate.year,
                this.state.endDate.month,
                this.state.endDate.day
              ).toLocaleDateString()
            }
          />
          <Button
            className="reset"
            onClick={this.reset}
            disabled={
              this.state.startDate === null && this.state.endDate === null
            }
          >
            Reset
          </Button>
        </div>
        <div className="Calendar">
          <div className="months">
            {/** @todo render to months in advance and swipe */}
            {this.state.displayedMonths.map(month => (
              <Month
                key={month.index}
                index={month.index}
                year={month.year}
                onDayClick={this.handleDayClick}
                selected={this.state.startDate}
              />
            ))}
          </div>
          {/** @todo RTL support */}
          <Elevation
            z={3}
            className="flipper forwards"
            onClick={this.forwardMonth}
          >
            <Icon use="keyboard_arrow_right" />
          </Elevation>
          <Elevation
            z={3}
            className="flipper backwards"
            onClick={this.backwardMonth}
          >
            <Icon use="keyboard_arrow_left" />
          </Elevation>
          <div className="footer">
            <Button className="done" raised onClick={this.close}>
              done
            </Button>
          </div>
        </div>
      </Card>
    );
  }
}
