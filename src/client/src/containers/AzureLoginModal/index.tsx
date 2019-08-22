import * as React from "react";
import { connect } from "react-redux";

import asModal from "../../components/Modal";

import { injectIntl, InjectedIntlProps } from "react-intl";
import { closeModalAction } from "../../actions/modalActions/modalActions";
import { AppState } from "../../reducers";
import { Dispatch } from "redux";
import RootAction from "../../actions/ActionType";
import { isAzureLoginModalOpenSelector } from "../../selectors/modalSelector";
import { EXTENSION_COMMANDS, EXTENSION_MODULES } from "../../utils/constants";
import buttonStyles from "../../css/buttonStyles.module.css";
import styles from "./styles.module.css";
import classnames from "classnames";
import { FormattedMessage } from "react-intl";
import keyUpHandler from "../../utils/keyUpHandler";
import { strings as messages } from "./strings";
import { KEY_EVENTS } from "../../utils/constants";
import { ReactComponent as Cancel } from "../../assets/cancel.svg";
import CollapsibleInfoBox from "../../components/CollapsibleInfoBox";

interface IStateProps {
  isModalOpen: boolean;
  vscode: any;
  isLoggedIn: boolean;
}

interface IDispatchProps {
  closeModal: () => any;
}

type Props = IStateProps & IDispatchProps & InjectedIntlProps;

const AzureLoginModal = (props: Props) => {
  const { formatMessage } = props.intl;
  const { isLoggedIn, closeModal } = props;
  const handleSignInClick = () => {
    // initiates a login command to VSCode ReactPanel class
    props.vscode.postMessage({
      command: EXTENSION_COMMANDS.AZURE_LOGIN,
      module: EXTENSION_MODULES.AZURE,
      track: true
    });
  };

  const cancelKeyDownHandler = (event: React.KeyboardEvent<SVGSVGElement>) => {
    if (event.key === KEY_EVENTS.ENTER || event.key === KEY_EVENTS.SPACE) {
      event.preventDefault();
      event.stopPropagation();
      closeModal();
    }
  };

  React.useEffect(() => {
    // close sign in modal when user logs in
    if (isLoggedIn) {
      closeModal();
    }
  }, [isLoggedIn]);

  return (
    <div>
      <div className={styles.headerContainer}>
        <div className={styles.title}>
          {formatMessage(messages.getStartedWithAzure)}
        </div>
        <Cancel
          tabIndex={0}
          className={styles.cancelIcon}
          onClick={props.closeModal}
          onKeyDown={cancelKeyDownHandler}
        />
      </div>

      <div className={styles.questionaryContainer}>
        <CollapsibleInfoBox
          question={formatMessage(messages.freeAccountQuestion)}
          answer={formatMessage(messages.freeAccountAnswer)}
          initialAnswerShownState={true}
        />
        <CollapsibleInfoBox
          question={formatMessage(messages.paymentQuestion)}
          answer={formatMessage(messages.paymentAnswer)}
        />
        <CollapsibleInfoBox
          question={formatMessage(messages.freeTrialQuestion)}
          answer={formatMessage(messages.freeTrialAnswer)}
        />
        <CollapsibleInfoBox
          question={formatMessage(messages.freeTrialUpgradeQuestion)}
          answer={formatMessage(messages.freeTrialUpgradeAnswer)}
        />
        <div className={styles.paragraph}>
          <a
            className={styles.link}
            href="https://azure.microsoft.com/en-us/free/free-account-faq/"
            onKeyUp={keyUpHandler}
          >
            <FormattedMessage
              id="azureLoginModal.azureReadMore"
              defaultMessage="Learn more about the Azure free account. Read the FAQ >"
            />
          </a>
        </div>
      </div>
      <div className={styles.footerContainer}>
        <button
          onClick={handleSignInClick}
          className={classnames(buttonStyles.buttonDark, styles.button)}
        >
          <FormattedMessage
            id="azureLoginModal.signIn"
            defaultMessage="Sign In"
          />
        </button>
        <div className={styles.buttonContainer}>
          <button
            className={classnames(
              styles.button,
              styles.buttonNext,
              buttonStyles.buttonHighlighted
            )}
          >
            <a
              className={styles.linkToButton}
              href="https://azure.microsoft.com/free/"
              onKeyUp={keyUpHandler}
            >
              <FormattedMessage
                id="azureLoginModal.createAccount"
                defaultMessage="Create Free Account"
              />
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState): IStateProps => {
  const { vscodeObject } = state.vscode;
  const { isLoggedIn } = state.azureProfileData;
  return {
    isModalOpen: isAzureLoginModalOpenSelector(state),
    vscode: vscodeObject,
    isLoggedIn
  };
};
const mapDispatchToProps = (
  dispatch: Dispatch<RootAction>
): IDispatchProps => ({
  closeModal: () => {
    dispatch(closeModalAction());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(asModal(injectIntl(AzureLoginModal)));
