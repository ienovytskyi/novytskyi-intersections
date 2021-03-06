# novytskyi-intersections
test task #2 for kottans


## Принцип работы программы:
* входные данные задаются в виде массивов объектов со свойствами x и y - координатами вершин многоугольников в файле solution.js (examples.first и examples.second);
* менять нужно исключительно координаты;
* координаты задаются последовательно: две последовательные пары координат составляют грань многоугольника, иначе невозможно определить струкруту многоугольника;
* результатом выполнения файла solution.js есть массив(ы) обьектов пересечения многоугольников или пустой массив, если многоугольники не пересекаются.


## На данный момент ведуться работы над:
- [x] откорректировать работу скрипта при налолжении граней/вершин, на данный момент скрипт зависает при таких входящих данных;
- [ ] реализовать проверку площади многоугольников (для многоугольников с самопересечением);
- [ ] поиск и устранение багов. например, при определенных входящих данных математические вычисления срабатывают неверно.

В связи с наличием багов, до их устранения не рекомендуется задавать сложные структуры, иначе не попасть мне на курсы :(


## Принцип работы алгоритма:

1. из двух последовательных пар координат строим отрезки, которые представляют собой грани многоугольников.
2. строим уравнения прямых по двум точкам.
3. проверяем пересечение каждой прямой с каждой прямой, находим точки пересечения и самопересечения.
4. проверяем полученные точки, лежат ли они на соответствующих отрезках.
5. проверяем принадлежит ли каждая вершина и точка самопересечения одного многоугольника другому многоугольнику. если да, то эта точка является вершиной многоунольника пересечения (в случае проверки вершины, проверка точек самопересечения нужна для нахождения площади многоугольника).
  * через проевряемую точку проводим горизонтальную прямую (уравнение прямой через одну точку с нулевым угловым коэффициентом) и фиксируем точки пересечения с интересующим нас многоугольником. отбрасываем точки пересечения левее по Х (делаем из прямой луч). если точек пересечения четное количество, вершина не принадлежит многоугольнику (луч входит и выходит из многоугольника). иначе принадлежит. 
  * если прямая проходит через вершину, меняем угловой коэффициент и повторяем все заново.
6. к точкам пересечения добавляем свойство "маршрут", которое определяет координаты точек, с которыми мы можем соединить данную точку. вначале добавляем все возможные маршруты для данной точки. в случае пересечения двух отрезков точка пересечения - наша точка, концы отрезков - возможные маршруты. далее проверяем принадлежат ли маршруты многоугольнику пересечения, нету ли между точкой и концом отрезка другого маршрута (в данном случае выбирается ближайшая точка), принадлежит ли отрезок "точка-маршрут" многоугольнику пересечения полностью.
7. предыдущие пункты находят все вершины многоугольника пересечения и возможные варианты их соединения (маршруты).
  * берем первую точку из массива точек пересечения. эта первая точка результирующего массива. берем первый маршрут данной точки. это вторая точка результирующего массива.
  * смотрим на маршруты второй точки результирующего массива. по одному маршруту "мы пришли", берем следующий доступный маршрут. это третья точка.
  * и так далее пока есть доступные маршруты. если доступных маршутов нет, мы замкнули контур.
  * если при этом в массиве точек пересечения остались незадействованные точки, берем первую из них, создаем новый результирующий массив и повторяем пункт 7.
8. результирующий(ие) массив(ы) готовы.

## Изменения:
11.04 - код более полно прокомментирован; подправлен файл маркдауна.

12.04 - добавлена обработка наложения граней/вершин.

13.04 - добавлена обработка площади многоугольника (в случае простого многоугольника).
