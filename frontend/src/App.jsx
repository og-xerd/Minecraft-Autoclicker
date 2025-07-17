import { useEffect, useState } from 'react'
import Autoclicker from './Autoclicker'
import MouseIcon from '@mui/icons-material/Mouse'
import { Button } from '@heroui/react';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import { motion, AnimatePresence } from 'framer-motion';
import Miner from './Miner';


function App() {
    const [view, setView] = useState("Autoclicker");

    const [visible, setVisible] = useState("");

    useEffect(() => {
        console.log(visible);
    }, [visible])

    return (
        <div className="font-satoshi text-white bg-[rgb(28,28,28)] w-[100vw] h-[100vh] flex dark relative overflow-hidden">
            <AnimatePresence mode="wait">
                {view == "Autoclicker" && <Autoclicker key={"autoclicker"}/>}
                {view == "Miner" && <Miner key={"miner"}/>}
            </AnimatePresence>

            <div className="absolute flex left-1/2 bottom-0 shadow-[0_0_10px_rgba(0,0,0,0.3)] z-20 bg-[rgb(28,28,28)] border-1 border-[rgb(45,45,45)] rounded-t-[15px] -translate-x-1/2 gap-[5px]">
                <button className="cursor-pointer ml-[5px] my-[5px] relative bg-[rgb(50,50,50)] flex items-center p-[5px] rounded-[15px] active:bg-[rgb(40,40,40)] active:scale-98 transition duration-100" onMouseEnter={() => setVisible("Autoclicker")} onMouseLeave={() => setVisible("")} onClick={() => setView("Autoclicker")}>
                    <MouseIcon sx={{fontSize: "30px"}}/>
                    <AnimatePresence mode="wait">
                        {(visible == "Autoclicker" || view == "Autoclicker") && 
                            <motion.div
                                key={"Autoclicker"}
                                initial={{ width: 0 }}
                                animate={{ width: "95px" }}
                                exit={{ width: 0}}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="overflow-hidden font-medium text-[18px]"
                            >
                                Autoclicker
                            </motion.div>
                        }
                    </AnimatePresence>
                </button>
                <button className="cursor-pointer mr-[5px] my-[5px] relative bg-[rgb(50,50,50)] flex items-center p-[5px] rounded-[15px] active:bg-[rgb(40,40,40)] active:scale-98 transition duration-100" onMouseEnter={() => setVisible("Miner")} onMouseLeave={() => setVisible("")} onClick={() => setView("Miner")}>
                    <SmartToyRoundedIcon sx={{fontSize: "30px"}}/>
                    <AnimatePresence mode="wait">
                        {(visible == "Miner" || view == "Miner") && 
                            <motion.div
                                key={"Miner"}
                                initial={{ width: 0 }}
                                animate={{ width: "50px" }}
                                exit={{ width: 0}}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="overflow-hidden font-medium text-[18px]"
                            >
                               Miner
                            </motion.div>
                        }
                    </AnimatePresence>
                </button>
            </div>
        </div>
  )
}

export default App
