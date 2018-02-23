import * as firebase from 'firebase';

export const CREATING = 'goal/CREATING';
export const SUCCESS = 'goal/SUCCESS';
export const ERROR = 'goal/ERROR';

export function goalCreating() {
  return {
    type: CREATING,
  };
}

// 목표
export function goalSuccess() {
  return {
    type: SUCCESS,
  };
}

export function goalError(errorMsg) {
  return {
    type: ERROR,
    errorMsg,
  };
}

const initialState = {
  creating: false,
  success: false,
  errorMsg: '',
  goal: '',
  ppomtime: 25,
  breaktime: 5,
  longbreaktime: 20,
  longbreakfrqncy: 4,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CREATING:
      return {
        creating: true,
        success: false,
        errorMsg: '',
        checkingItem: '',
        goal: '',
        ppomtime: 0,
        breaktime: 0,
        longbreaktime: 0,
        longbreakfrqncy: 0,
      };
    case SUCCESS:
      return {
        creating: false,
        success: true,
        errorMsg: '',
        checkingItem: '',
        goal: action.goal,
        ppomtime: action.ppomtime,
        breaktime: action.breaktime,
        longbreaktime: action.longbreaktime,
        longbreakfrqncy: action.longbreakfrqncy,
      };
    case ERROR:
      return {
        creating: false,
        success: false,
        errorMsg: action.errorMsg,
        checkingItem: '',
        goal: '',
        ppomtime: 0,
        breaktime: 0,
        longbreaktime: 0,
        longbreakfrqncy: 0,
      };
    default:
      return state;
  }
}

export const createGoal = ({
  goal, ppomtime, breaktime, longbreaktime, longbreakfrqncy,
}) => async (dispatch) => {
  // goalObj 유효성 체크
  // if (!goal ) {
  //   dispatch(goalError('필드를 모두 채워주세요.'));
  //   return;
  // }

  const { currentUser } = firebase.auth();
  if (!currentUser) {
    return;
  }
  dispatch(goalCreating());

  try {
    await firebase.database().ref(`goals/${currentUser.uid}`).push({
      goal,
      ppomtime,
      breaktime,
      longbreaktime,
      longbreakfrqncy,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
    });
    dispatch(goalSuccess());
  } catch (e) {
    dispatch(goalError(`알 수 없는 에러가 발생했습니다. 다시 시도해 주세요: ${e.message}`));
  }
};

export const checkValidGoal = ({
  goal, ppomtime, longbreaktime, longbreakfrqncy, breaktime, checkingItem,
}) => (dispatch) => {
  const name = checkingItem;
  let value;
  switch (name) {
    case 'goal':
      value = goal;
      if (value.length > 30) {
        dispatch(goalError('더 짧아야 효율이 좋아요.'));
      }
      break;
    case 'ppomtime' || 'longbreaktime':
      value = ppomtime || longbreaktime;
      if (value > 120) {
        dispatch(goalError('더 짧아야 효율이 좋아요.'));
      } else if (value < 1) {
        dispatch(goalError('1분 이상만 입력 가능합니다.'));
      }
      break;
    case 'breaktime':
      value = breaktime;
      if (value > 40) {
        dispatch(goalError('더 짧아야 효율이 좋아요.'));
      } else if (value < 1) {
        dispatch(goalError('1분 이상만 입력 가능합니다.'));
      }
      break;
    case 'longbreakfrqncy':
      value = longbreakfrqncy;
      if (value < 2 || value > 10) {
        dispatch(goalError('긴 휴식 간격은 2 ~ 10 사이의 값만 입력 가능합니다.'));
      }
      break;
    default:
      break;
  }
};