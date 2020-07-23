declare module Wick {

    export interface Os {
        architecture: number;
        family: string;
        version: string;
    }

    export interface Platform {
        name: string;
        version: string;
        product?: any;
        manufacturer?: any;
        layout: string;
        os: Os;
        description: string;
    }

    export interface Metadata {
        wickengine: string;
        lastModified: number;
        platform: Platform;
    }

    export interface Project {
        classname: string;
        identifier?: any;
        name: string;
        uuid: string;
        children: string[];
        width: number;
        height: number;
        backgroundColor: string;
        framerate: number;
        onionSkinEnabled: boolean;
        onionSkinSeekForwards: number;
        onionSkinSeekBackwards: number;
        focus: string;
        metadata: Metadata;
    }

  export interface RootObject {
    project: Project
    objects: {
      [key: string]: {
        name?: string
        classname: string
        scripts?: ({ name: string, src: string })[]
      }
    }
  }
}
