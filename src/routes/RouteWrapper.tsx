/*
 * @Author: yongyuan at <yongyuan253015@gmail.com>
 * @Date: 2021-07-15 22:57:20
 * @LastEditTime: 2021-07-15 23:08:55
 * @LastEditors: yongyuan at <yongyuan253015@gmail.com>
 * @Description: 
 * @FilePath: \works_space\src\routes\RouteWrapper.tsx
 * 
 */
import { useMemo } from "react";
const { DocumentTitle } = require('react-document-title')
function RouteWrapper(props: any) {
    let { Comp, route, ...restProps } = props;
    const queryMemo = useMemo(() => {
        const queryReg = /\?\S*/g;
        const matchQuery = (reg: any) => {
            const queryParams = restProps.location.search.match(reg);
            return queryParams ? queryParams[0] : '{}';
        };
        return matchQuery(queryReg);
    }, [restProps.location.search]);
    const mergeQueryToProps = () => {
        const queryReg = /\?\S*/g;
        const removeQueryInRouter = (restProps: any, reg: any) => {
            const { params } = restProps.match;
            Object.keys(params).forEach((key) => {
                params[key] = params[key] && params[key].replace(reg, '');
            });
            restProps.match.params = { ...params };
        };

        restProps = removeQueryInRouter(restProps, queryReg);
        const merge = {
            ...restProps,
            query: queryMemo,
        };
        return merge;
    };

    return <DocumentTitle>
        <Comp {...mergeQueryToProps()} />
    </DocumentTitle>
}

export default RouteWrapper