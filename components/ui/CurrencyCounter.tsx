'use client'
import React from 'react';
import CountUp from 'react-countup';
// destructuring props : type check
const CurrencyCounter = ({amount} : {amount : number}) => {
  return (
    <p className='w-full'>
         <CountUp end={amount} 
            decimal=','
            decimals={2}
            duration={.75}
            prefix='$'
         /> 
    </p>
  )
}

export default CurrencyCounter