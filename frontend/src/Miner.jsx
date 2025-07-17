import { motion } from 'framer-motion';
import { Button } from "@heroui/react";
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import LoopRoundedIcon from '@mui/icons-material/LoopRounded';

export default function Miner() {
    return (
        <motion.div
            className="flex-[1] bg-[rgb(24,24,24)] m-[15px] rounded-[10px] flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
        >
            Comming soon...
        </motion.div>
    )
}