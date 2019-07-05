import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

const AnimationStyles = styled.span`
  position: relative;
  .count {
    display: block;
    position: relative;
    transition: all 0.4s; /* matches the 'CSSTransition 'enter' and 'exit' values */
    backface-visibility: hidden;
  }

  /* new red dot is added rotated */
  .count-enter {
    transform: scale(4) rotateX(0.5turn);
  }

  /* when is displayed, then do the animation to put it in the correct angle */
  .count-enter-active {
    transform: rotateX(0);
  }

  /* old red dot is initially in the right position */
  .count-exit {
    top: 0;
    position: absolute;
    transform: rotateX(0);
  }

  /* it flips along with the new red dot, causing the 'coin flip' effect */
  .count-exit-active {
    transform: scale(4) rotateX(0.5turn);
  }
`;

const Dot = styled.div`
  background: ${props => props.theme.red};
  color: white;
  border-radius: 50%;
  padding: 0.5rem;
  line-height: 2rem;
  min-width: 3rem;
  margin-left: 1rem;
  font-weight: 100;
  
  /* these two keep the size of any number always with the same proportiopn (e.g. 1, 50, 99999) */
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`;

const CartCount = ({ count }) => (
  <AnimationStyles>
    <TransitionGroup>
      <CSSTransition
        unmountOnExit
        className="count"
        classNames="count"
        key={count}
        timeout={{ enter: 400, exit: 400 }}
      >
        <Dot>{count}</Dot>
      </CSSTransition>
    </TransitionGroup>
  </AnimationStyles>
);

export default CartCount;