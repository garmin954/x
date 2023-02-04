import { Suspense } from "react"

/**
 * @param Component 懒加载的组件
 * @returns 
 */
 const LazyLoad = (Component: React.LazyExoticComponent<() => JSX.Element>) => {
    return (
          <Suspense fallback={<div>loading...</div>}>
             <Component />
          </Suspense>
    )
 }
 
 export default LazyLoad