'use strict';

import React, { Component, PropTypes } from 'react';

import Item from './Item';
import Paginator from './Paginator';
import scrollToY from 'scroll-to-y';

export default class Slider extends Component {

  constructor(props) {
    super(props);

    this.state = { activeIndex: 1 };

    this.setActive = this.setActive.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.lastScroll = 0;

    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    if (this.isAnimating) {
      return;
    }

    // up
    if (
      window.scrollY > this.lastScroll &&
      window.innerHeight + window.scrollY >
        ((window.innerHeight * this.state.activeIndex) + window.innerHeight/2)
    ) {
      this.setActive(this.state.activeIndex + 1);
    // down
    } else if (
      window.scrollY < this.lastScroll &&
      window.innerHeight + window.scrollY <
        ((window.innerHeight * this.state.activeIndex) - window.innerHeight/1.5)
    ) {
      this.setActive(this.state.activeIndex - 1);
    }

    this.lastScroll = window.scrollY;
  }

  setActive(index, scrollTo) {
    this.setState({ activeIndex: index }, () => {
      if (scrollTo) {
        this.isAnimating = true;
        scrollToY(
          this.refs[`slide-${ index }`].offsetTop,
          500,
          'easeInOutQuint',
          () => {
            this.isAnimating = false;
          }
        );
      }
    });
  }

  render() {
    if (!this.props.children) {
      return null;
    }

    return (
      <div className="viewport-slider">
        {this.props.children.map((child, key) => {
          let index = key + 1;
          return (
            <div ref={`slide-${ index }`} key={index}>
              <Item {...child.props}
                index={index}
                hideButton={true}
                onClick={this.setActive}>
                {child}
              </Item>
            </div>
          );
        })}
      </div>
    );
  }

}

Slider.defaultProps = {};

Slider.propTypes = {};
