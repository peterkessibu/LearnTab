// components/loading.tsx
'use client'
import React from "react";
import { newtonsCradle } from 'ldrs'

newtonsCradle.register()

    
const Loading = () => {
    return (
            <div className="loader">
                < l-newtons-cradle
                    size="100"
                    speed="1.4"
                    color="#1e3a8a"
                ></l-newtons-cradle>
            </div>
    );
};

export default Loading;
