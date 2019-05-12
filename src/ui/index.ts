export class Box{
    public container:HTMLElement;
    public header:HTMLElement;
    public body:HTMLElement;
    public list = [];
    public title:string;
    private isOpen = false;
    constructor(title:string){
        this.title = title;
        this.container = document.createElement('div');
        this.container.classList.add('ui-container');
        this.header = document.createElement('div');
        this.header.classList.add('ui-container-header');
        this.body = document.createElement('div');
        this.body.classList.add('ui-container-list');
        let titleNode = document.createElement('div');
        this.container.appendChild(this.header);
        titleNode.classList.add('ui-container-title');
        this.container.appendChild(this.body);
        this.header.innerHTML= this.title;
        let toggleView = document.createElement('button');
        toggleView.classList.add('ui-button');
        toggleView.innerHTML = 'Hide';
        toggleView.style.cssFloat = 'right;'
        toggleView.classList.add('ui-close-button');
        toggleView.onclick = () => {
            this.isOpen = !this.isOpen;
            if(this.isOpen){
                toggleView.innerHTML = 'Show'
                this.body.innerHTML = ''
            }else{
                toggleView.innerHTML = 'Hide'
                this.body = this.renderBody();
            }
            
        }
        this.body.addEventListener('box_body_changed', () => {
            this.renderBody();
        });
        this.header.appendChild(toggleView);
        
    }

    render = (style = null) => {
        if(style){
            for (var property in style) {
                if (style.hasOwnProperty(property)) {
                    this.container.style[property] = style[property];
                }
            }
        }
        this.renderBody();
        return this.container;
    }

    renderBody = () => {
        this.list.map(element => {
            element.classList.add('ui-container-list-item');
            this.body.appendChild(element);
        });
        return this.body;
    }

    push = (element:HTMLElement) => {
        this.list.push(element);
        this.body.dispatchEvent(new Event('box_body_changed'));
    }
}

export class Input{
    public input:HTMLElement;
    public label:HTMLElement;
    public container:HTMLElement;
    public constructor(label, callback, value = null){
        this.container = document.createElement('div');
        this.label = document.createElement('div');
        this.label.classList.add('ui-label');
        this.label.innerHTML = label;
        this.input = document.createElement('input');
        this.input.classList.add('ui-input-field');
        this.input.onkeydown = (event) => {
            var value = parseFloat(event.target.value);
            callback(value || 10);
        }
    }
    render = () => {
        this.container.innerHTML = '';
        this.container.appendChild(this.label);
        this.container.appendChild(this.input);
        return this.container;
    }
}

export class Button{
    public button:HTMLElement;
    public label:HTMLElement;
    public container:HTMLElement;
    public constructor(label, callback){
        this.container = document.createElement('div');
        this.label = document.createElement('div');
        this.button = document.createElement('button');
        this.button.classList.add('ui-button');
        this.button.innerHTML = label;
        this.button.onclick = () => {
            callback();
        }
    }
    render = () => {
        this.container.innerHTML = '';
        this.container.appendChild(this.button);
        return this.container;
    }
}
export class TextBox{
    public TextBox:HTMLElement;
    public label:HTMLElement;
    public container:HTMLElement;
    public constructor(label){
        this.container = document.createElement('div');
        this.label = document.createElement('div');
        this.TextBox = document.createElement('div');
        this.TextBox.classList.add('ui-textBox');
        this.TextBox.innerHTML = label;
    }
    render = () => {
        this.container.innerHTML = '';
        this.container.appendChild(this.TextBox);
        return this.container;
    }
}

export class LoadingScreen{
    private container:HTMLElement;
    private loader: HTMLElement;
    private resource: HTMLElement;
    constructor(){
        this.container = document.createElement('div');
        this.loader = document.createElement('div');
        this.resource = document.createElement('div');
        this.container.classList.add('ui-loading-screen-container');
        this.loader.classList.add('ui-loading-screen-loader');
    }
    render = (total_resources, remaining_resources, current_resource_name ) => {
        this.container.innerHTML = '';
        var loaded_percent  = 100*(total_resources - remaining_resources)/ total_resources;
        if(loaded_percent == 100){
            return;
        }
        this.resource.innerHTML = "Loading "+current_resource_name+" ...";
        this.container.appendChild(this.loader);
        this.container.appendChild(this.resource);
        this.loader.style.width = loaded_percent+'%';
        return this.container;
    }
}