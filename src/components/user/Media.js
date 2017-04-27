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
      file: '',
      image_preview_url: '',
      get_media_result: null
    }
    this.onChange = this.onChange.bind(this);
    this.handleFile = this.handleFile.bind(this);
  }

  onChange(state) {
    this.setState(state);
  }

  getMediaEvent(event) {
    event.preventDefault();
    store.dispatch(ProfileActions.getMedia(this.state.query))
      .then(data => {
        // console.log(store.getState());
        this.setState({query: '', get_media_result: store.getState().rootReducer.user.profile.get_media_result});
      })
  }

  uploadMediaEvent(event) {
    event.preventDefault();
    // console.log(this.state.image_preview_url);
    store.dispatch(ProfileActions.uploadMedia(this.state.file))
      .then(data => {
        // console.log(store.getState());
        this.setState({file: '', image_preview_url: '', query: store.getState().rootReducer.user.profile.upload_media_result.id});
      })
  }

  handleFile(event) {
    event.preventDefault();

    var reader = new FileReader();
    var file = event.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        image_preview_url: reader.result
      });
    };
    reader.readAsDataURL(file);

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

    var {image_preview_url} = this.state;
    let $image_preview = null;
    if (image_preview_url) {
      $image_preview = (<img src={image_preview_url} />);
    } else {
      $image_preview = (<div>Select a file to preview</div>)
    }

    return (
      <div>
        <div className="form-container">

          <div>{$image_preview}</div>

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
    result: state.rootReducer.user.profile.upload_media_result
  };
};

export default connect(mapStateToProps)(Media);