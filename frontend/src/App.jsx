import { useState, useEffect, useRef, useMemo } from 'react'
import mouse from './assets/mouse.png'
import leftButton from './assets/leftButton.png'
import leftButtonActive from './assets/leftButtonActive.png'
import rightButton from './assets/rightButton.png'
import rightButtonActive from './assets/rightButtonActive.png'
import mousePad from './assets/mousePad.png'
import './App.css'
import { motion, AnimatePresence } from 'framer-motion';
import { Slider, Button, Switch, Input, Checkbox, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, InputOtp, Chip } from "@heroui/react";
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import LoopRoundedIcon from '@mui/icons-material/LoopRounded';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import InventoryIcon from '@mui/icons-material/Inventory';
import { LoadSettings, SaveSettings, UpdateSettings } from "../wailsjs/go/main/App";
import { main } from "../wailsjs/go/models";

function Settings({ windowName, setWindowName, setViewSettings, saveSettings, loadSettings }) {
    const divRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (divRef.current && !divRef.current.contains(event.target)) {
                setViewSettings(false);
            }
        }
      
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <motion.div
            className="absolute mt-[10px] shadow-[0_0_10px_rgba(0,0,0,0.3)] right-0 z-20 bg-[rgb(24,24,24)] border-1 border-[rgb(64,64,64)] flex flex-col gap-[10px] rounded-[10px] overflow-hidden"
            ref={divRef}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
        >
            <div className="flex mt-[5px] justify-center">
                <label className="text-[20px] font-medium">Settings</label>
            </div>
            <div className="mx-[10px]">
                <Input
                    className="min-w-[270px]"
                    label="Minecraft Window Name"
                    value={windowName}
                    spellCheck={false}
                    onValueChange={setWindowName}
                    type="text"
                    size="sm"
                    variant="bordered"
                />
            </div>
            <div className="mt-auto mx-[10px] mb-[10px] flex gap-[5px]">
                <Button isIconOnly className="w-full bg-success-200 gap-[2px] focus:outline-none" onClick={saveSettings}>
                    <SaveRoundedIcon sx={{fontSize: "30px"}}/>
                </Button>
                <Button isIconOnly className="gap-[2px] focus:outline-none" onClick={loadSettings}>
                    <LoopRoundedIcon sx={{fontSize: "30px"}}/>
                </Button>
            </div>
        </motion.div>
    )
}

function Hotbar({ setViewHotbar, hotbar, setHotbar }) {
    const divRef = useRef(null);


    useEffect(() => {
        function handleClickOutside(event) {
            if (divRef.current && !divRef.current.contains(event.target)) {
                setViewHotbar(false);
            }
        }
      
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleKeybind = (i) => (e) => {
        setHotbar(prevItems => {
            const newItems = [...prevItems];
            newItems[i] = {...newItems[i], keybind: e.key};
            return newItems;
        })
    }

    return (
        <motion.div
            className="absolute mt-[10px] shadow-[0_0_10px_rgba(0,0,0,0.3)] right-[50px] z-20 bg-[rgb(24,24,24)] border-1 border-[rgb(64,64,64)] flex flex-col gap-[5px] rounded-[10px] overflow-hidden"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            ref={divRef}
        >
            <div className="flex mt-[5px] justify-center">
                <label className="text-[20px] font-medium">Inventory</label>
            </div>
            <div className="mx-[10px] flex items-center mt-[3px] gap-[5px]">
                <Chip>s - Sword</Chip>
                <Chip>b - Block</Chip>
                <Chip>n - None</Chip>
            </div>
            <div className="flex gap-[5px] mx-[10px] mb-[10px]">
                {Array.from({length: 9}).map((_, i) => (
                    <div key={i} className="flex flex-col">
                        <InputOtp 
                            key={i}
                            value={hotbar[i].mode}
                            onValueChange={(value) => (
                                setHotbar(prevItems => {
                                    const newItems = [...prevItems];
                                    newItems[i] = {...newItems[i], mode: value};
                                    return newItems;
                                })
                            )}
                            allowedKeys="^[a-z]*$"
                            length={1}
                        />
                        <Button
                            className="focus:outline-none min-w-[40px] p-0 h-[30px] rounded-[5px]"
                            onContextMenu={(e) => e.preventDefault()}
                            onKeyDown={handleKeybind(i)}
                            //isDisabled={leftButtonListening} 
                            //onClick={() => setLeftButtonListening(true)}
                        >{hotbar[i].keybind}</Button>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

function App() {
    const [leftButtonHover, setLeftButtonHover] = useState(false);
    const [rightButtonHover, setRightButtonHover] = useState(false);

    const [leftButtonImage, setLeftButtonImage] = useState(leftButton);
    const [rightButtonImage, setRightButtonImage] = useState(rightButton);

    const [leftButtonListening, setLeftButtonListening] = useState(false);
    const [rightButtonListening, setRightButtonListening] = useState(false);

    const [leftButtonKeybind, setLeftButtonKeybind] = useState("");
    const [rightButtonKeybind, setRightButtonKeybind] = useState("");

    const [leftCps, setLeftCps] = useState([1, 3]);
    const [rightCps, setRightCps] = useState([1, 3]);

    const [leftEnabled, setLeftEnabled] = useState(true);
    const [rightEnabled, setRightEnabled] = useState(true);

    const [leftToggle, setLeftToggle] = useState(false);
    const [rightToggle, setRightToggle] = useState(false);

    const [viewSettings, setViewSettings] = useState(false);
    const [viewHotbar, setViewHotbar] = useState(false);

    const [clickingSound, setClickingSound] = useState(false);

    const [windowName, setWindowName] = useState("Minecraft 1.8.8");

    const [hotbar, setHotbar] = useState([{ mode: "", keybind: "1" }, { mode: "", keybind: "2" }, { mode: "", keybind: "3" }, { mode: "", keybind: "4" }, { mode: "", keybind: "5" }, { mode: "", keybind: "6" }, { mode: "", keybind: "7" }, { mode: "", keybind: "8" },{ mode: "", keybind: "9" }]);

    const settingsDeps = [leftEnabled, rightEnabled, leftCps, rightCps, leftButtonKeybind, rightButtonKeybind, leftToggle, rightToggle, windowName, clickingSound, hotbar];

    const settings = useMemo(() => {
        return new main.Settings({
            LeftEnabled: leftEnabled,
            RightEnabled: rightEnabled,
            LeftCps: leftCps,
            RightCps: rightCps,
            LeftKeybind: leftButtonKeybind,
            RightKeybind: rightButtonKeybind,
            LeftToggle: leftToggle,
            RightToggle: rightToggle,
            WindowName: windowName,
            ClickingSound: clickingSound,
            Hotbar: hotbar,
        });
    }, settingsDeps);

    async function saveSettings() {
        await SaveSettings(settings);
    }

    async function loadSettings() {
        let settings = await LoadSettings();

        setLeftCps(settings.LeftCps);
        setLeftEnabled(settings.LeftEnabled);
        setLeftButtonKeybind(settings.LeftKeybind);
        setRightCps(settings.RightCps);
        setRightEnabled(settings.RightEnabled);
        setRightButtonKeybind(settings.RightKeybind);
        setLeftToggle(settings.LeftToggle);
        setRightToggle(settings.RightToggle)
        setWindowName(settings.WindowName);
        setClickingSound(settings.ClickingSound);
    }

    useEffect(() => {
        async function updateSettings() {
            await UpdateSettings(settings);
        }

        updateSettings();
    }, settingsDeps)

    function handleKeyDown(e) {
        if (leftButtonListening) {
            setLeftButtonKeybind(e.key.toLowerCase());
            setLeftButtonListening(false);
        } else if (rightButtonListening) {
            setRightButtonKeybind(e.key.toLowerCase());
            setRightButtonListening(false);
        }
    }

    function handleClick(e) {
        let buttonName;
        switch (e.button) {
            case 0:
                buttonName = "Left Button";
                break;
            case 1:
                buttonName = "Scroll Button";
                break;
            case 2:
                buttonName = "Right Button";
                break;
            case 3:
                buttonName = "Side Button 1";
                break;
            case 4:
                buttonName = "Side Button 2";
                break;
        }

        if (leftButtonListening) {
            setLeftButtonKeybind(buttonName);
            setLeftButtonListening(false);
        } else if (rightButtonListening) {
            setRightButtonKeybind(buttonName);
            setRightButtonListening(false);
        }
    }
    
    useEffect(() => {
        if (!leftButtonListening && !rightButtonListening) return;

        window.addEventListener("mousedown", handleClick);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("mousedown", handleClick);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [leftButtonListening, rightButtonListening]);

    return (
        <div className="relative font-satoshi text-white bg-[rgb(28,28,28)] w-[100vw] h-[100vh] flex justify-center items-center dark">
            <div className="relative rounded-[10px] overflow-hidden">
                
                <div className="absolute top-[10px] right-[10px]">
                    <Button isIconOnly className="focus:outline-none bg-[rgb(50,50,50)] rounded-[10px] mr-[10px]" onClick={() => setClickingSound(!clickingSound)}>
                        {clickingSound ? <VolumeUpIcon sx={{fontSize: "30px"}}/> : <VolumeOffIcon sx={{fontSize: "30px"}}/>}
                    </Button>

                    <Button isIconOnly className="focus:outline-none bg-[rgb(50,50,50)] rounded-[10px] mr-[10px]" onClick={() => {setViewHotbar(!viewHotbar); setViewSettings(false)}}>
                        <InventoryIcon sx={{fontSize: "30px"}}/>
                    </Button>

                    <Button isIconOnly className="focus:outline-none bg-[rgb(50,50,50)] rounded-[10px]" onClick={() => {setViewSettings(!viewSettings); setViewHotbar(false)}}>
                        <SettingsRoundedIcon sx={{fontSize: "30px"}}/>
                    </Button>
                    
                    <AnimatePresence mode="wait">
                        {viewSettings && <Settings key={1} windowName={windowName} setWindowName={setWindowName} setViewSettings={setViewSettings} saveSettings={saveSettings} loadSettings={loadSettings}/>}
                        {viewHotbar && <Hotbar key={2} setViewHotbar={setViewHotbar} hotbar={hotbar} setHotbar={setHotbar} />}
                    </AnimatePresence>
                </div>

                <img src={mousePad} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <img src={mouse} className="drop-shadow-xl" />
                    <div 
                        className="absolute left-[9px] top-[0px] cursor-pointer transition duration-300"
                        onMouseEnter={() => {
                            setLeftButtonImage(leftButtonActive)
                            setLeftButtonHover(true)
                        }}
                        onMouseLeave={() => {
                            setLeftButtonImage(leftButton)
                            setLeftButtonHover(false)
                        }}
                    >
                        <img src={leftButtonImage} className=""/>

                        <AnimatePresence>
                        {
                            leftButtonHover && (
                                <motion.div
                                    className="absolute bg-[rgb(24,24,24)] top-[-30px] left-[-190px] z-20 rounded-[10px] cursor-auto p-[10px] flex flex-col gap-[13px] border-1 border-[rgb(64,64,64)] shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                                    initial={{ opacity: 0, scale: 1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                >   
                                    <div className="flex justify-between items-center">
                                        <label className="text-[22px] font-medium">Left Button</label>
                                        <Switch isSelected={leftEnabled} onValueChange={setLeftEnabled} color="success" size="sm"></Switch>
                                    </div>
                                    <Slider
                                        className="w-[200px] font-medium"
                                        defaultValue={[1, 3]}
                                        label="CPS"
                                        maxValue={25}
                                        minValue={1}
                                        step={1}
                                        value={leftCps}
                                        onChange={(value) => setLeftCps(value)}
                                        size="sm"
                                    />
                                    <Checkbox isSelected={leftToggle} onValueChange={setLeftToggle} size="md">
                                        Toggle
                                    </Checkbox>
                                    <Button
                                        className="focus:outline-none"
                                        onContextMenu={(e) => e.preventDefault()}
                                        isDisabled={leftButtonListening} 
                                        onClick={() => setLeftButtonListening(true)}
                                    >{leftButtonKeybind ? leftButtonKeybind: "Keybind"}</Button>
                                </motion.div>  
                            )
                        }
                        </AnimatePresence>
                    </div>

                    <div 
                        className="absolute right-[9px] top-[0px] cursor-pointer transition duration-300"
                        onMouseEnter={() => {
                            setRightButtonImage(rightButtonActive)
                            setRightButtonHover(true)
                        }}
                        onMouseLeave={() => {
                            setRightButtonImage(rightButton)
                            setRightButtonHover(false)
                        }}
                    >
                        <img src={rightButtonImage} className=""/>

                        <AnimatePresence>
                        {
                            rightButtonHover && (
                                <motion.div
                                    className="absolute bg-[rgb(24,24,24)] top-[-30px] right-[-190px] z-20 rounded-[10px] cursor-auto p-[10px] flex flex-col gap-[13px] border-1 border-[rgb(64,64,64)] shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                                    initial={{ opacity: 0, scale: 1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                >
                                    <div className="flex justify-between items-center">
                                        <label className="text-[22px] font-medium">Right Button</label>
                                        <Switch isSelected={rightEnabled} onValueChange={setRightEnabled} color="success" size="sm"></Switch>
                                    </div>
                                    <Slider
                                        className="w-[200px] font-medium"
                                        label="CPS"
                                        maxValue={25}
                                        minValue={1}
                                        step={1}
                                        value={rightCps}
                                        onChange={(value) => setRightCps(value)}
                                        size="sm"
                                    />
                                    <Checkbox isSelected={rightToggle} onValueChange={setRightToggle} size="md">
                                        Toggle
                                    </Checkbox>
                                    <Button
                                        className="focus:outline-none"
                                        onContextMenu={(e) => e.preventDefault()}
                                        isDisabled={rightButtonListening} 
                                        onClick={() => setRightButtonListening(true)}
                                    >{rightButtonKeybind ? rightButtonKeybind : "Keybind"}</Button>
                                </motion.div>  
                            )
                        }
                        </AnimatePresence>
                    </div>
                    
                </div>
            </div>
        </div>
  )
}

export default App
