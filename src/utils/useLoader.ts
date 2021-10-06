import { useState, useEffect, DependencyList } from 'react';


export interface Loader<T> {
    data?: T;
    isLoading: boolean;
    error?: Error;
    reload(): void;
}

export const useLoader = <T extends {}>(
    loaderFunction: () => Promise<T>,
    deps: DependencyList = []
): Loader<T> => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | undefined>();
    const [data, setData] = useState<T | undefined>();
    const reload = () => {
        setIsLoading(true);
        setError(undefined);
        setData(undefined);
        loaderFunction()
            .then(value => setData(value))
            .catch(err => setError(err))
            .finally(() => setIsLoading(false));
    };
    useEffect(reload, [...deps]);
    return { data, isLoading, error, reload };
};