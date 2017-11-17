// Taken from https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html
export interface CancellablePromise<T> {
  promise: Promise<T>;
  cancel: () => void;
}

export function catchCancelNoOp(err: any) {
  if(err.isCanceled)
      return Promise.resolve();
  return Promise.reject(err);
}

export function makeCancelable<T>(promise: Promise<T>) : CancellablePromise<T> {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
      promise.then(
          val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
          error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
      );
  });

  return {
      promise: wrappedPromise,
      cancel() {
          hasCanceled_ = true;
      },
  };
};