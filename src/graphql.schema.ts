
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum CacheControlScope {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}

export interface MutationResponse {
    code: number;
    success: boolean;
    message: string;
}

export class Demo {
    id: string;
    title: string;
    description: string;
    updatedAt: string;
}

export abstract class IQuery {
    abstract demos(): Demo[] | Promise<Demo[]>;

    abstract demo(id: string): Nullable<Demo> | Promise<Nullable<Demo>>;
}

type Nullable<T> = T | null;
