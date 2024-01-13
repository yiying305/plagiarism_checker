import { useEffect, useState } from 'react';
import './index.css';

const Loading = () => {

    return (
        <div id='loading' className="w-full h-full flex justify-center items-center">
            <div className="w-1/3 h-1/3 absolute">
                <div className="loading-text text-center font-bold">
                    Processing
                </div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        </div>
    )
}

export default Loading;
