import '../App.css';
import Toast from 'react-bootstrap/Toast';
import ColorModel from "./ColorModel";

function AlertMessage(props) {
    if (props.alert) {
        return (
            <div aria-live="polite" aria-atomic="true" className="alert-container">
                {/* close alert after 5000ms or when clicked on "close" button */}
                <Toast onClose={() => props.callback()} show={true} delay={5000} autohide>
                  <Toast.Header closeButton={false}>
                    {/* describe what happen (in short) */}
                    <strong className="position-relative">
                        {props.title}
                        {props.color !== undefined
                          ?
                            <div className="dropdown-color">
                                <ColorModel color={props.color}/>
                            </div>
                          :
                            undefined
                        }
                    </strong>
                    <small className="text-right">
                        <label style={{cursor: "pointer"}} onClick={props.callback}>
                            close
                        </label>
                    </small>
                  </Toast.Header>
                    {/* describe what happen with more details */}
                  <Toast.Body className="text-center">
                      {props.reason}
                  </Toast.Body>
                </Toast>
            </div>
        )
    }
    return null;
}

export default AlertMessage;
