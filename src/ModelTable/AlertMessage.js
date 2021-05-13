import '../App.css';
import Toast from 'react-bootstrap/Toast'

function AlertMessage(props) {
    if (props.alert) {
        return (
            <div aria-live="polite" aria-atomic="true" className="alert-container">
                <Toast onClose={() => props.callback()} show={true} delay={5000} autohide>
                  <Toast.Header closeButton={false}>
                    <strong>{props.title}</strong>
                    <small className="text-right">
                        <a type="button" onClick={props.callback} >
                            close
                        </a>
                    </small>
                  </Toast.Header>
                  <Toast.Body className="text-center">{props.reason}</Toast.Body>
                </Toast>
            </div>
        )
    }
    return null;
}

export default AlertMessage;
