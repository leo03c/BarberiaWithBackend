import { motion, AnimatePresence } from 'framer-motion';
// eslint-disable-next-line react/prop-types
export const ModalNotification = ({ color, message, isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            top: '0px', 
            left: '40%',
            transform: 'translateX(-50%)',
            backgroundColor: color,
            padding: '10px 20px',
            borderRadius: '5px',
            zIndex: 1000,
          }}
        >
          <div className='flex '>
            <p className='m-0'>{message}</p>
            <button className='ml-2 bg-transparent border-none text-[16px] cursor-pointer'>
              X
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
