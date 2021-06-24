import { useState, useCallback } from 'react'
import { createOrderDefaultState } from "../utils/config"
/**
 * 强制刷新
 */
const useUpdate = () => {
    const [_, setState] = useState(0);
    return useCallback(() => {
        setState(createOrderDefaultState);
    }, []);
};

export default useUpdate