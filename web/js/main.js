const API_URL = "https://h4sfca69w2.execute-api.us-east-2.amazonaws.com/test"

class AddPerson extends React.Component {
    constructor(props) {
        super(props);
        this.state = { formData: {"First": '', "Last": '', "Food": '', "Color": '', "Major": ''}, success: null};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        var change = {success: null, formData: this.state.formData};
        change.formData[event.target.name] = event.target.value;
        this.setState(change);
    }

    getSuccessText(value){
        if (value == null){
            return "";
        }
        if (value == true){
            return "Added " + this.state.formData.First + " successfully!";        
        }
        return "There was an error adding the user";
    }

    async handleSubmit(event) {
        event.preventDefault();
        const resp = await fetch(API_URL + "/add-user", {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.formData)
        }
        )
        if (await resp.status == 200){
            this.setState({success: true});
        }
        else{
            this.setState({success: true});
        }
    }

    render() {
        return (
            <div className="add-user">
                <form onSubmit={this.handleSubmit}>
                    <div className="formgroup">
                        <label htmlFor="First">First Name</label>
                        <input type="text"
                            className="form-control"
                            id="First"
                            aria-describedby="FirstHelp"
                            placeholder="Ex: John"
                            value={this.state.formData.First}
                            onChange={this.handleChange}
                            name="First"
                            required />
                        <small id="FirstHelp" className="form-text text-muted">The first name of your user (required).</small>
                    </div>
                    <div className="formgroup">
                        <label htmlFor="Last">Last Name</label>
                        <input type="text" 
                            className="form-control" 
                            id="Last" 
                            aria-describedby="LastHelp" 
                            placeholder="Ex: Laboe" 
                            value={this.state.formData.Last}
                            onChange={this.handleChange}
                            name="Last"
                            required />
                        <small id="LastHelp" className="form-text text-muted">The last name of your user (required).</small>
                    </div>
                    <div className="formgroup">
                        <label htmlFor="Food">Favorite Food</label>
                        <input type="text" 
                            className="form-control" 
                            id="Food" 
                            aria-describedby="FoodHelp" 
                            placeholder="Ex: Pizza" 
                            value={this.state.formData.Food}
                            onChange={this.handleChange}
                            name="Food"
                            />
                        <small id="FoodHelp" className="form-text text-muted">The user's favorite food.</small>
                    </div>
                    <div className="formgroup">
                        <label htmlFor="Color">Favorite Color</label>
                        <input type="text" 
                            className="form-control" 
                            id="Color" 
                            aria-describedby="ColorHelp" 
                            placeholder="Ex: Blue" 
                            value={this.state.formData.Color}
                            onChange={this.handleChange}
                            name="Color"
                            />
                        <small id="ColorHelp" className="form-text text-muted">The user's favorite color.</small>
                    </div>
                    <div className="formgroup">
                        <label htmlFor="Major">Major</label>
                        <input type="text" 
                            className="form-control" 
                            id="Major" 
                            aria-describedby="MajorHelp" 
                            placeholder="Ex: Laboe" 
                            value={this.state.formData.Major}
                            onChange={this.handleChange}
                            name="Major"
                            />
                        <small id="MajorHelp" className="form-text text-muted">The major of your user (required).</small>
                    </div>
                    <input type="submit" value="Submit" className="btn btn-primary" />
                    <div id="submission-status">{this.getSuccessText(this.state.success)}</div>
                </form>
            </div>
        );
    }
}

class About extends React.Component {
    render() {
        return (
            <ul className="list-group-flush">
                <li className="list-group-item">School: Northwestern University</li>
                <li className="list-group-item">Major(s): Applied Math and Computer Science</li>
                <li className="list-group-item">Clubs: Robotics, Track</li>
                <li className="list-group-item">Looking for: Full-Stack Developer Position</li>
                <li className="list-group-item">Hobbies: Piano, Running</li>
            </ul>
        )
    }
}

class UserView extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        console.log(this.props.data);
        var data = {};
        for (var key of Object.keys(this.props.data)){
            if (this.props.data[key] != null){
                data[key] = this.props.data[key];
            }
            else {
                data[key] = "N/A";
            }
        }
        console.log(data);
        return(
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{data.First + " " + data.Last}</h5>
                    <p className="card-text">Favorite Food: {data.Food}</p>
                    <p className="card-text">Favorite Color: {data.Color}</p>
                    <p className="card-text">Major: {data.Major}</p>
                </div>
            </div>
        );
        
    }
    
}

class UserList extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        console.log(this.props.users);
        
        const userViews = this.props.users.data.map((data, index) =>
            <UserView data={data} key={index} />
        );
        return (
            userViews
        );
    }
}


class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = { formData: {"First": '', "Last": '', "Food": '', "Color": '', "Major": ''}, success: null, users: {data: []}};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        var change = {success: null, formData: this.state.formData};
        change.formData[event.target.name] = event.target.value;
        this.setState(change);

        this.handleSubmit(event);
    }

    getSuccessText(value){
        if (value == null){
            return "";
        }
        if (value == true){
            return "Added " + this.state.formData.First + " successfully!";        
        }
        return "There was an error adding the user";
    }

    async handleSubmit(event) {
        event.preventDefault();
        var data_in = {};
        for (var key of Object.keys(this.state.formData)){
            if (this.state.formData[key] != ''){
                data_in[key] = this.state.formData[key];
            }
        }
        const resp = await fetch(API_URL + "/get-user", {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data_in)
        }
        )
        if (await resp.status == 200){
            this.setState({success: true, users: await resp.json()});
           
        }
        else{
            this.setState({success: true});
        }
        console.log(this.state);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="add-user col-sm">
                        <form onSubmit={this.handleSubmit}>
                            <div className="formgroup">
                                <label htmlFor="First">First Name</label>
                                <input type="text"
                                    className="form-control"
                                    id="First"
                                    aria-describedby="FirstHelp"
                                    placeholder="Ex: John"
                                    value={this.state.formData.First}
                                    onChange={this.handleChange}
                                    name="First"
                                    />
                                <small id="FirstHelp" className="form-text text-muted">The first name of your user (required).</small>
                            </div>
                            <div className="formgroup">
                                <label htmlFor="Last">Last Name</label>
                                <input type="text" 
                                    className="form-control" 
                                    id="Last" 
                                    aria-describedby="LastHelp" 
                                    placeholder="Ex: Laboe" 
                                    value={this.state.formData.Last}
                                    onChange={this.handleChange}
                                    name="Last"
                                    />
                                <small id="LastHelp" className="form-text text-muted">The last name of your user (required).</small>
                            </div>
                            <div className="formgroup">
                                <label htmlFor="Food">Favorite Food</label>
                                <input type="text" 
                                    className="form-control" 
                                    id="Food" 
                                    aria-describedby="FoodHelp" 
                                    placeholder="Ex: Pizza" 
                                    value={this.state.formData.Food}
                                    onChange={this.handleChange}
                                    name="Food"
                                    />
                                <small id="FoodHelp" className="form-text text-muted">The user's favorite food.</small>
                            </div>
                            <div className="formgroup">
                                <label htmlFor="Color">Favorite Color</label>
                                <input type="text" 
                                    className="form-control" 
                                    id="Color" 
                                    aria-describedby="ColorHelp" 
                                    placeholder="Ex: Blue" 
                                    value={this.state.formData.Color}
                                    onChange={this.handleChange}
                                    name="Color"
                                    />
                                <small id="ColorHelp" className="form-text text-muted">The user's favorite color.</small>
                            </div>
                            <div className="formgroup">
                                <label htmlFor="Major">Major</label>
                                <input type="text" 
                                    className="form-control" 
                                    id="Major" 
                                    aria-describedby="MajorHelp" 
                                    placeholder="Ex: Laboe" 
                                    value={this.state.formData.Major}
                                    onChange={this.handleChange}
                                    name="Major"
                                    />
                                <small id="MajorHelp" className="form-text text-muted">The major of your user (required).</small>
                            </div>
                        </form>
                    </div>
                    <div className="col-sm cards">
                        <UserList users={this.state.users} />
                    </div>
                </div>
            </div>
        );
    }
}

class MainApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {key: "add"};
    }

    render() {
        return (
            <div>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    
                    <li className="nav-item">
                        <a className="nav-link" id="about-tab" data-toggle="tab" href="#about" role="tab" aria-controls="about" aria-selected="false">About</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link active" id="add-tab" data-toggle="tab" href="#add" role="tab" aria-controls="add" aria-selected="true">Add User</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="search-tab" data-toggle="tab" href="#search" role="tab" aria-controls="search" aria-selected="false">Search Users</a>
                    </li>
                </ul>
                <div className ="tab-content" id="myTabContent">
                    
                    <div className ="tab-pane fade" id="about" role="tabpanel" aria-labelledby="about-tab">
                        <About />
                    </div>
                    <div className ="tab-pane fade show active" id="add" role="tabpanel" aria-labelledby="add-tab">
                        <AddPerson />
                    </div>
                    <div className ="tab-pane fade" id="search" role="tabpanel" aria-labelledby="search-tab">
                        <Search />
                    </div>
                </div>
            </div>
          );
    }
}


ReactDOM.render(
    <MainApp />,
    document.querySelector('#add-person')
);