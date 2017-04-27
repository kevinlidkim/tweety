import React, {PropTypes} from 'react';  
import {connect} from 'react-redux';
import * as ProfileActions from '../../actions/ProfileActions';
import configureStore from '../../store/configureStore';

const store = configureStore();


class Media extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      data_uri: {},
      filename: '',
      filetype: '',
      get_media_result: null
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(state) {
    this.setState(state);
  }

  getMediaEvent(event) {
    event.preventDefault();
    store.dispatch(ProfileActions.getMedia(this.state.query))
      .then(data => {
        // console.log(store.getState());
        this.setState({query: '', get_media_result: store.getState().rootReducer.user.profile.media_result});
      })
  }

  uploadMediaEvent(event) {
    event.preventDefault();
    store.dispatch(ProfileActions.uploadMedia(this.state.upload_media_buffer))
      .then(data => {
        // console.log(store.getState());
        this.setState({upload_media_buffer: {} });
      })
  }

  handleFile(e) {
    var reader = new FileReader();
    var file = e.target.files[0];

    reader.onload = (upload) => {
      this.setState({
        data_uri: upload.target.result,
        filename: file.name,
        filetype: file.type
      });
    };

    reader.readAsDataURL(file);

    console.log(file);
    console.log("above = file, below = reader");
    console.log(reader);
  }

  render() {

    var displayResult = null;
    if (this.state.get_media_result != null) {
      displayResult = (
        <div>
          DISPLAY MEDIA HERE
        </div>
      )
    }

    return (
      <div>
        <div className="form-container">
          <form className="form">
            <div className="form-group">
              <label htmlFor="upload_media_buffer">Upload Media</label>
              <input type="file" placeholder="Upload media here" id="upload_media_buffer" className="form-control"
                onChange={this.handleFile}/>
            </div>
            <button type="submit" className="btn btn-default" onClick={this.uploadMediaEvent.bind(this)}>Upload</button>
          </form>

          <form className="form">
            <div className="form-group">
              <label htmlFor="query">Get Media by ID</label>
              <input type="text" placeholder="Type query here" id="query" className="form-control"
                value={this.state.query}
                onChange={e => this.setState({ query:e.target.value })}/>
            </div>
            <button type="submit" className="btn btn-default" onClick={this.getMediaEvent.bind(this)}>Get</button>
          </form>
          <h4>Get Media Result</h4>
          <div>{displayResult}</div>
        </div>
      </div>
    );
  }
}

Media.propTypes = {  
  result: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    result: state.rootReducer.user.profile.media_result
  };
};

export default connect(mapStateToProps)(Media);