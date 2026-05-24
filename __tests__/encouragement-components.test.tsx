import EncouragementToast, { useEncouragementToast } from '@/components/EncouragementToast';
import type { EncouragementMessage } from '@/types';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// テスト用のメッセージ
const mockMessage: EncouragementMessage = {
  id: 'test_001',
  text: 'テスト用の励ましメッセージです。頑張って！',
  emoji: '🌟',
  category: 'motivation',
  context: []
};

// useEncouragementToast フックのテスト用コンポーネント
function TestHookComponent() {
  const { currentMessage, showMessage, hideMessage } = useEncouragementToast();

  return (
    <div>
      <button
        onClick={() => showMessage(mockMessage)}
        data-testid="show-message"
      >
        Show Message
      </button>
      <button
        onClick={hideMessage}
        data-testid="hide-message"
      >
        Hide Message
      </button>
      {currentMessage && (
        <div data-testid="current-message">
          {currentMessage.text}
        </div>
      )}
    </div>
  );
}

describe('EncouragementToast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('メッセージが表示される', () => {
    const onClose = jest.fn();
    render(
      <EncouragementToast
        message={mockMessage}
        onClose={onClose}
      />
    );

    expect(screen.getByText('学習応援メッセージ')).toBeInTheDocument();
    expect(screen.getByText(mockMessage.text)).toBeInTheDocument();
    expect(screen.getByText(mockMessage.emoji)).toBeInTheDocument();
  });

  it('メッセージがnullの場合、何も表示されない', () => {
    const onClose = jest.fn();
    const { container } = render(
      <EncouragementToast
        message={null}
        onClose={onClose}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('閉じるボタンをクリックするとonCloseが呼ばれる', async () => {
    const onClose = jest.fn();
    render(
      <EncouragementToast
        message={mockMessage}
        onClose={onClose}
      />
    );

    const closeButton = screen.getByLabelText('メッセージを閉じる');
    fireEvent.click(closeButton);

    // アニメーション完了を待つ
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('自動非表示タイマーが動作する', async () => {
    const onClose = jest.fn();
    render(
      <EncouragementToast
        message={mockMessage}
        onClose={onClose}
        autoHideDuration={3000}
      />
    );

    // 3秒経過
    jest.advanceTimersByTime(3000);

    // アニメーション完了を待つ
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('異なるポジションでレンダリングされる', () => {
    const onClose = jest.fn();
    const { rerender } = render(
      <EncouragementToast
        message={mockMessage}
        onClose={onClose}
        position="top-center"
      />
    );

    // 最上位のコンテナ要素を取得
    let container = document.querySelector('[class*="fixed"]');
    expect(container).toHaveClass('top-4');
    expect(container).toHaveClass('left-1/2');

    rerender(
      <EncouragementToast
        message={mockMessage}
        onClose={onClose}
        position="bottom-right"
      />
    );

    container = document.querySelector('[class*="fixed"]');
    expect(container).toHaveClass('bottom-4');
    expect(container).toHaveClass('right-4');
  });
});

describe('useEncouragementToast', () => {
  it('メッセージの表示・非表示が正しく動作する', () => {
    render(<TestHookComponent />);

    // 初期状態ではメッセージなし
    expect(screen.queryByTestId('current-message')).not.toBeInTheDocument();

    // メッセージを表示
    fireEvent.click(screen.getByTestId('show-message'));
    expect(screen.getByTestId('current-message')).toBeInTheDocument();
    expect(screen.getByTestId('current-message')).toHaveTextContent(mockMessage.text);

    // メッセージを非表示
    fireEvent.click(screen.getByTestId('hide-message'));
    expect(screen.queryByTestId('current-message')).not.toBeInTheDocument();
  });
});


