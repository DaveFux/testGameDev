
const checkOutOfBounds = (objectPosition, textureScale) => {
    return (
        -textureScale.x - _w / 2 > objectPosition.x ||
        objectPosition.x > _w / 2 + textureScale.x ||
        -textureScale.y - _h / 2 > objectPosition.y ||
        objectPosition.y > _h / 2 + textureScale.y
        );
    };
    
    const createFirework = (begin, duration, colour, position, type, velocity) => {
        let firework;
        if (type === "Rocket") {
            firework = new Rocket(begin, duration, colour, position, velocity);
        } else {
            firework = new Fountain(begin, duration, colour, position);
        }
        _entities.push(firework);
        _fireworks.push(firework);
    };

    const getFireworkAttribute = (fireworkInfo, tag, index, elementTag) => {
      if (fireworkInfo === undefined) {
        throw new Error(
          `Something is wrong with ${elementTag} of your Fireworks nº${
            index + 1
          }! Please check your XML file.`
        );
      } else {
        let attrib = fireworkInfo.getAttribute(tag);
        if (attrib === null) {
          throw new Error(
            `Something is wrong with ${tag} of your Fireworks nº${
              index + 1
            }! Please check your XML file.`
          );
        } else {
          return attrib;
        }
      }
    };
    
    const clearFireworks = () => {
        _fireworks = _fireworks.filter(
            (firework) =>
            !firework.hasExpired ||
      (firework.hasExpired && firework.particles.length > 0)
  );
};
