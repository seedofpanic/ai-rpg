import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { projectileStore } from '../models/projectileStore';

const ProjectileContainer = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #e76f51;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const ProjectileView: React.FC = observer(() => {
  return (
    <>
      {Array.from(projectileStore.projectiles.values()).map((projectile) => (
        <ProjectileContainer
          key={projectile.id}
          style={{
            left: `${projectile.position.x}px`,
            top: `${projectile.position.y}px`,
          }}
        />
      ))}
    </>
  );
});

export default ProjectileView;
