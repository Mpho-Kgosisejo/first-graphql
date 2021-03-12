
import React from 'react';

import './modal.css';

export class Modal extends React.Component {

  render = () => {

    const {
      title,
      children,
      onCancel,
      isLoading,
      onConfirm
    } = this.props;

    return (
      <div className="modal">

        <div className="main">

          { title &&

            <header>
              { title }
            </header>
          }

          { children &&

          <section className="content">
            { children }
          </section>
          }

          { (onCancel || onConfirm) &&

            <section className="actions">

              { onConfirm &&

                <button
                  className="btn confirm"
                  onClick={onConfirm}
                >
                  { !isLoading ? 'Confirm' : 'Loading' }
                </button>
              }

              { onCancel &&

                <button
                  className="btn cancel"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              }

            </section>
          }

        </div>

      </div>
    );
  }
}