import React from 'react';

export const EventItem = ({
  _id,
  date,
  title,
  price,
  active,
  creator,
  onClick,
  leftText,
  isOfUser,
  isDelete,
  isLoggedIn,
  description,
  showLeftText,
  onLeftTextClick,
}) => (
  <li
    onClick={onClick}
    className={`${active ? 'active' : ''} ${isDelete ? 'delete' : ''}`}
  >

    { title }

    <div className='sub-content'>

      { date &&

        <div>
          { new Date(date).toLocaleString() }
        </div>
      }

      <div className='link'>
        { `R ${price}` }
      </div>

    </div>

    { active &&

      <>
        <div className='content'>
          { description }
        </div>

        <div className='footer'>

          { showLeftText &&

            <div
              className={`price ${isDelete ? 'delete' : ''}`}
              onClick={(e) => {
                e.stopPropagation();

                onLeftTextClick(_id);
              }}
            >
              { leftText
                ? leftText
                : 'Book'
              }
            </div>
          }

          { !showLeftText && <div></div>}

          <div className='creator'>
            Created by <b>
              { isOfUser
                ? 'you'
                : creator.email
              }
            </b>
          </div>

        </div>
      </>
    }
  </li>
);