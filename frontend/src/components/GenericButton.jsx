import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../styles/_button.scss';

export default function GenericButton({
  variant = 'primary',
  size = 'sm',
  icon = null,
  iconPosition = 'left',
  circle = false,
  className = '',
  children,
  ...props
}) {
  const btnClass = classNames(
    'btn',
    `btn-${variant}`,
    {
      [`btn-${size}`]: size,
      'btn-circle': circle,
      'd-flex align-items-center justify-content-center': !!icon && circle,
    },
    className
  );

  return (
    <button className={btnClass} {...props}>
      {circle ? (
        icon
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="me-2">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="ms-2">{icon}</span>}
        </>
      )}
    </button>
  );
}

GenericButton.propTypes = {
  variant: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg']),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  circle: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};
