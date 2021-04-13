import React from 'react';

export const D20 = (props) => {
    return (
        <svg style={props.style} width={props.width} height={props.height} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="dice-d20" class={`${props.className} svg-inline--fa fa-dice-d20 fa-w-15`}
        role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 512">
            <path fill={props.fill} d="M106.75 215.06L1.2 370.95c-3.08 5 .1 11.5 5.93 12.14l208.26 22.07-108.64-190.1zM7.41 
            315.43L82.7 193.08 6.06 147.1c-2.67-1.6-6.06.32-6.06 3.43v162.81c0 4.03 5.29 5.53 7.41 2.09zM18.25 423.6l194.4 87.66c5.3 
            2.45 11.35-1.43 11.35-7.26v-65.67l-203.55-22.3c-4.45-.5-6.23 5.59-2.2 7.57zm81.22-257.78L179.4 22.88c4.34-7.06-3.59-15.25-10.78-11.14L17.81 
            110.35c-2.47 1.62-2.39 5.26.13 6.78l81.53 48.69zM240 176h109.21L253.63 7.62C250.5 2.54 245.25 0 240 0s-10.5 2.54-13.63 7.62L130.79 
            176H240zm233.94-28.9l-76.64 45.99 75.29 122.35c2.11 3.44 7.41 1.94 7.41-2.1V150.53c0-3.11-3.39-5.03-6.06-3.43zm-93.41 
            18.72l81.53-48.7c2.53-1.52 2.6-5.16.13-6.78l-150.81-98.6c-7.19-4.11-15.12 4.08-10.78 11.14l79.93 142.94zm79.02 250.21L256 
            438.32v65.67c0 5.84 6.05 9.71 11.35 7.26l194.4-87.66c4.03-1.97 2.25-8.06-2.2-7.56zm-86.3-200.97l-108.63 190.1 208.26-22.07c5.83-.65 
            9.01-7.14 5.93-12.14L373.25 215.06zM240 208H139.57L240 383.75 340.43 208H240z">
            </path>
        </svg> 
    )
}

export const FancyStar = (props) => {
    return (
        <svg width={props.width} height={props.height} className={"star-filled " + props.className} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 70 40" style={props.style} xml="preserve">
        <g>
            <path className="sparkles" d="M0.3,21.8C0.1,21.4,0,21.1,0,20.7l0,0c0-0.5,0.2-0.9,0.5-1.2C0.8,19.2,1.3,19,1.7,19h4c0.5,0,1.1,0.3,1.4,0.7
                c0.2,0.3,0.3,0.7,0.3,1c0,1-0.9,1.8-1.8,1.8h-4C1.2,22.5,0.7,22.2,0.3,21.8L0.3,21.8z"/>
            <path className="sparkles" d="M2,40c-0.8,0-1.4-0.5-1.6-1.2c-0.2-0.5-0.2-0.9,0.1-1.3c0.2-0.4,0.5-0.8,1-0.9l6.2-2.1
                c0.2-0.1,0.4-0.1,0.5-0.1c0.8,0,1.4,0.5,1.6,1.2c0.3,0.9-0.2,1.9-1.1,2.3L2.5,40C2.3,39.9,2.1,40,2,40L2,40z"/>
            <path className="sparkles" d="M7,8.1c-0.2,0-0.4,0-0.5-0.1l-5-2.3c0,0-0.1,0-0.2-0.1C0.2,5.2-0.2,4.2,0.2,3.3c0.3-0.6,0.9-1.1,1.6-1.1
                c0.2,0,0.5,0.1,0.7,0.2l4.9,2.3C8.3,5,8.8,6,8.5,7C8.4,7.6,7.7,8.1,7,8.1L7,8.1z"/>
            <path className="sparkles" d="M69.7,21.8c0.2-0.3,0.3-0.7,0.3-1.1l0,0c0-0.5-0.2-0.9-0.5-1.2c-0.3-0.3-0.8-0.5-1.2-0.5h-4
                c-0.5,0-1.1,0.3-1.4,0.7c-0.2,0.3-0.3,0.7-0.3,1c0,1,0.9,1.8,1.8,1.8h4C68.8,22.5,69.3,22.2,69.7,21.8L69.7,21.8z"/>
            <path className="sparkles" d="M68,40c0.8,0,1.4-0.5,1.6-1.2c0.2-0.5,0.2-0.9-0.1-1.3c-0.2-0.4-0.5-0.8-1-0.9l-6.3-2.1
                c-0.2-0.1-0.4-0.1-0.5-0.1c-0.8,0-1.4,0.5-1.6,1.2c-0.3,0.9,0.2,1.9,1.1,2.3l6.2,2.1C67.7,39.9,67.9,40,68,40L68,40z"/>
            <path className="sparkles" d="M63,8.1c0.2,0,0.4,0,0.5-0.1l5.1-2.3c0,0,0.1,0,0.2-0.1c0.9-0.4,1.3-1.4,0.9-2.3c-0.3-0.6-0.9-1.1-1.6-1.1
                c-0.2,0-0.5,0.1-0.7,0.2l-5.1,2.3C61.4,5,60.9,6,61.2,7C61.6,7.6,62.3,8.1,63,8.1L63,8.1z"/>
            <path className="fill" d="M55.1,17.2c0.7-0.7,0.8-1.9,0.1-2.6c-0.3-0.3-0.7-0.5-1.1-0.5l-12-1.7c-0.1,0-0.2-0.1-0.2-0.2L36.6,1.5
                c-0.3-0.6-0.9-1.1-1.6-1.1s-1.3,0.5-1.6,1.1l-5.3,10.8c0,0.1-0.1,0.2-0.2,0.2L16,14.2c-0.5,0.1-0.9,0.3-1.2,0.7s-0.4,0.9-0.4,1.3
                c0.1,0.4,0.2,0.8,0.5,1.1l8.6,8.3c0.1,0.1,0.1,0.2,0.1,0.2l-2,11.9c-0.2,1,0.5,1.9,1.5,2.1c0.1,0,0.2,0,0.3,0
                c0.3,0,0.6-0.1,0.9-0.2L35,33.9h0.1c0,0,0.1,0,0.2,0l10.6,5.5c0.2,0.2,0.5,0.2,0.9,0.2c0.5,0,0.9-0.2,1.3-0.5
                c0.3-0.3,0.5-0.8,0.5-1.3c0-0.1,0-0.2,0-0.3l-2-11.8c0-0.1,0-0.2,0.1-0.2L55.1,17.2z"/>
            <path className="outline" d="M55.1,17.2c0.7-0.7,0.8-1.9,0.1-2.6c-0.3-0.3-0.7-0.5-1.1-0.5l-12-1.7c-0.1,0-0.2-0.1-0.2-0.2L36.6,1.5
                c-0.3-0.6-0.9-1.1-1.6-1.1s-1.3,0.5-1.6,1.1l-5.3,10.8c0,0.1-0.1,0.2-0.2,0.2L16,14.2c-0.5,0.1-0.9,0.3-1.2,0.7s-0.4,0.9-0.4,1.3
                c0.1,0.4,0.2,0.8,0.5,1.1l8.6,8.3c0.1,0.1,0.1,0.2,0.1,0.2l-2,11.9c-0.2,1,0.5,1.9,1.5,2.1c0.1,0,0.2,0,0.3,0
                c0.3,0,0.6-0.1,0.9-0.2L35,33.9h0.1c0,0,0.1,0,0.2,0l10.6,5.5c0.2,0.2,0.5,0.2,0.9,0.2c0.5,0,0.9-0.2,1.3-0.5
                c0.3-0.3,0.5-0.8,0.5-1.3c0-0.1,0-0.2,0-0.3l-2-11.8c0-0.1,0-0.2,0.1-0.2L55.1,17.2z M44,23c-0.9,0.9-1.3,2.1-1.1,3.4l1.5,8.4
                l-7.6-4c-0.5-0.3-1.2-0.5-1.8-0.5s-1.2,0.2-1.8,0.5l-7.6,4l1.4-8.4c0.2-1.2-0.2-2.5-1.1-3.4l-6.1-5.9l8.4-1.2
                c1.2-0.2,2.3-0.9,2.9-2.1l3.7-7.6l3.8,7.6c0.5,1.2,1.6,1.9,2.9,2.1l8.4,1.2L44,23z"/>
        </g>
        </svg>
    )
}

export const Star = (props) => {
    return (
        <svg width={props.width} height={props.height} className={props.className} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="14 0 42 40" style={props.style} xml="preserve">
        <g>
            <path className="fill" d="M55.1,17.2c0.7-0.7,0.8-1.9,0.1-2.6c-0.3-0.3-0.7-0.5-1.1-0.5l-12-1.7c-0.1,0-0.2-0.1-0.2-0.2L36.6,1.5
                c-0.3-0.6-0.9-1.1-1.6-1.1s-1.3,0.5-1.6,1.1l-5.3,10.8c0,0.1-0.1,0.2-0.2,0.2L16,14.2c-0.5,0.1-0.9,0.3-1.2,0.7s-0.4,0.9-0.4,1.3
                c0.1,0.4,0.2,0.8,0.5,1.1l8.6,8.3c0.1,0.1,0.1,0.2,0.1,0.2l-2,11.9c-0.2,1,0.5,1.9,1.5,2.1c0.1,0,0.2,0,0.3,0
                c0.3,0,0.6-0.1,0.9-0.2L35,33.9h0.1c0,0,0.1,0,0.2,0l10.6,5.5c0.2,0.2,0.5,0.2,0.9,0.2c0.5,0,0.9-0.2,1.3-0.5
                c0.3-0.3,0.5-0.8,0.5-1.3c0-0.1,0-0.2,0-0.3l-2-11.8c0-0.1,0-0.2,0.1-0.2L55.1,17.2z"/>
            <path className="outline" d="M55.1,17.2c0.7-0.7,0.8-1.9,0.1-2.6c-0.3-0.3-0.7-0.5-1.1-0.5l-12-1.7c-0.1,0-0.2-0.1-0.2-0.2L36.6,1.5
                c-0.3-0.6-0.9-1.1-1.6-1.1s-1.3,0.5-1.6,1.1l-5.3,10.8c0,0.1-0.1,0.2-0.2,0.2L16,14.2c-0.5,0.1-0.9,0.3-1.2,0.7s-0.4,0.9-0.4,1.3
                c0.1,0.4,0.2,0.8,0.5,1.1l8.6,8.3c0.1,0.1,0.1,0.2,0.1,0.2l-2,11.9c-0.2,1,0.5,1.9,1.5,2.1c0.1,0,0.2,0,0.3,0
                c0.3,0,0.6-0.1,0.9-0.2L35,33.9h0.1c0,0,0.1,0,0.2,0l10.6,5.5c0.2,0.2,0.5,0.2,0.9,0.2c0.5,0,0.9-0.2,1.3-0.5
                c0.3-0.3,0.5-0.8,0.5-1.3c0-0.1,0-0.2,0-0.3l-2-11.8c0-0.1,0-0.2,0.1-0.2L55.1,17.2z M44,23c-0.9,0.9-1.3,2.1-1.1,3.4l1.5,8.4
                l-7.6-4c-0.5-0.3-1.2-0.5-1.8-0.5s-1.2,0.2-1.8,0.5l-7.6,4l1.4-8.4c0.2-1.2-0.2-2.5-1.1-3.4l-6.1-5.9l8.4-1.2
                c1.2-0.2,2.3-0.9,2.9-2.1l3.7-7.6l3.8,7.6c0.5,1.2,1.6,1.9,2.9,2.1l8.4,1.2L44,23z"/>
        </g>
        </svg>
    )
}

export const CircleSlot = (props) => {
    return (
        <svg className={props.className} width={props.width} height={props.height}viewBox="0 0 85 75" xmlns="http://www.w3.org/2000/svg">
            <circle className="fill" cx="40" cy="40" r='32' strokeWidth="7"/>
            <circle className="outline" cx="40" cy="40" r='32' strokeWidth="7"/>
        </svg>
    )
}
