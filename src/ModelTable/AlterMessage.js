import '../App.css';
import Toast from 'react-bootstrap/Toast'

function AlterMessage(props) {
    if (props.alert) {
        return (
            <div aria-live="polite" aria-atomic="true" style={{
                  zIndex: 10,
                // position: 'relative',
                minHeight: '200px',
              }}>
              <div style={{
                    // display: "inline-block",
                  position: 'absolute',
                  top: 0,
                  right: 0,
                }}>
                <Toast onClose={() => props.callback()} show={true} delay={5000} autohide>
                  <Toast.Header closeButton={false}>
                      {/*<button type="button" className="close ml-2 mb-1" data-dismiss="toast">*/}
                      {/*    <span aria-hidden="true">×</span>*/}
                      {/*    <span className="sr-only">Close</span>*/}
                      {/*</button>*/}
                    <strong className="mr-auto">{props.title}</strong>
                    {/*<small>just now</small>*/}
                  </Toast.Header>
                  <Toast.Body>{props.reason}</Toast.Body>
                </Toast>
              </div>
            </div>
        )
    }
    return null;
}

export default AlterMessage;
