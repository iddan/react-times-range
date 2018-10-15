import React, { Component } from "react";
import { Card } from "@rmwc/card";
import { TextField } from "@rmwc/textfield";
import { Button } from "@rmwc/button";
import { Elevation } from "@rmwc/elevation";
import { Ripple } from "@rmwc/ripple";
import { Icon } from "@rmwc/icon";
import Month from "./Month";
import "@rmwc/icon/icon.css";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/line-ripple/dist/mdc.line-ripple.css";
import "@material/card/dist/mdc.card.css";
import "@material/button/dist/mdc.button.css";
import "@material/typography/dist/mdc.typography.css";
import "@material/elevation/dist/mdc.elevation.css";
import "@material/ripple/dist/mdc.ripple.css";
import "@material/theme/dist/mdc.theme.css";
import "./TimesRange.css";

/**
 * @todo
 * make body positioned absolutely so it won't hurt flow
 * add time pickers
 */

export default class TimesRange extends Component {
  state = {
    open: false,
    displayedMonths: [
      { index: 0, year: new Date().getFullYear() },
      { index: 1, year: new Date().getFullYear() },
      { index: 2, year: new Date().getFullYear() },
      { index: 3, year: new Date().getFullYear() }
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
    this.setState({ movingBackwards: true });
    setTimeout(() => {
      /**
       * @todo dont assume 12 months a year
       */
      this.setState(prevState => ({
        displayedMonths: prevState.displayedMonths.map(month => ({
          index: month.index === 0 ? 11 : month.index - 1,
          year: month.index === 0 ? month.year - 1 : month.year
        })),
        movingBackwards: false
      }));
    }, 200);
  };

  forwardMonth = () => {
    this.setState({ movingForwards: true });
    setTimeout(() => {
      this.setState(prevState => ({
        displayedMonths: prevState.displayedMonths.map(month => ({
          index: month.index === 11 ? 0 : month.index + 1,
          year: month.index === 11 ? month.year + 1 : month.year
        })),
        movingForwards: false
      }));
    }, 200);
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
              this.state.startDate
                ? new Date(
                    this.state.startDate.year,
                    this.state.startDate.month,
                    this.state.startDate.day
                  ).toLocaleDateString()
                : ""
            }
          />
          <div className="field-divider" />
          <TextField
            value={
              /** @todo make this date time string */
              this.state.endDate
                ? new Date(
                    this.state.endDate.year,
                    this.state.endDate.month,
                    this.state.endDate.day
                  ).toLocaleDateString()
                : ""
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
          <div
            className={[
              "months",
              this.state.movingBackwards && "moving-backwards",
              this.state.movingForwards && "moving-forwards"
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="months__inner">
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
          </div>
          {/** @todo RTL support */}
          <Ripple>
            <Elevation
              z={3}
              className="flipper forwards"
              onClick={this.forwardMonth}
            >
              <Icon use="keyboard_arrow_right" />
            </Elevation>
          </Ripple>
          <Ripple>
            <Elevation
              z={3}
              className="flipper backwards"
              onClick={this.backwardMonth}
            >
              <Icon use="keyboard_arrow_left" />
            </Elevation>
          </Ripple>
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
