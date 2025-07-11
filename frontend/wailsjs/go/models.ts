export namespace main {
	
	export class Settings {
	    LeftEnabled: boolean;
	    RightEnabled: boolean;
	    LeftKeybind: string;
	    RightKeybind: string;
	    LeftCps: number[];
	    RightCps: number[];
	    LeftToggle: boolean;
	    RightToggle: boolean;
	    ClickingSound: boolean;
	    WindowName: string;
	
	    static createFrom(source: any = {}) {
	        return new Settings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.LeftEnabled = source["LeftEnabled"];
	        this.RightEnabled = source["RightEnabled"];
	        this.LeftKeybind = source["LeftKeybind"];
	        this.RightKeybind = source["RightKeybind"];
	        this.LeftCps = source["LeftCps"];
	        this.RightCps = source["RightCps"];
	        this.LeftToggle = source["LeftToggle"];
	        this.RightToggle = source["RightToggle"];
	        this.ClickingSound = source["ClickingSound"];
	        this.WindowName = source["WindowName"];
	    }
	}

}

