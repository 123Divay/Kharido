import { Step, StepLabel, Stepper, Typography } from '@material-ui/core'
import { AccountBalance, LibraryAddCheck, LocalShipping } from '@material-ui/icons'
import React, { Fragment } from 'react'
import './CheckOutStep.css'

const CheckOutStep = ({activeStep}) => {
    const steps = [
        {
            label:<Typography>Shipping Details</Typography>,
            icon:<LocalShipping/>,
        },
        {
            label:<Typography>Confirm Order</Typography>,
            icon:<LibraryAddCheck/>,
        },
        {
            label:<Typography>Payment</Typography>,
            icon:<AccountBalance/>,
        },
    ]

    const stepStyle = {
        boxSizing:"border-box",
    }


  return (
    <Fragment>
        <Stepper alternativeLabel activeStep={activeStep} style={stepStyle}>
            {steps.map((item,index) => (
                <Step key={index} active={activeStep === index ? true : false } 
                completed={activeStep >= index ? true : false}>
                <StepLabel style={{color: activeStep >= index ? "rgb(8, 247, 59)" : "rgba(0,0,0,0.65)"}} 
                icon={item.icon}>{item.label} </StepLabel>
                </Step>
            ))}
        </Stepper>

    </Fragment>
  )
}

export default CheckOutStep