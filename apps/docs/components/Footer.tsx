import Image from 'next/image';
import { useTheme } from 'nextra-theme-docs';
import React from 'react';
import logoNsf from './logo-nsf.png';
import logoUofU from './logo-uofu.png';
import logoVdl from './logo-vdl.png';

export function Footer() {
  const theme = useTheme();
  const mode = theme.resolvedTheme || 'dark';

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: mode === 'dark' ? 'rgba(255,255,255, 0.4)' : 'inherit',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            src={logoUofU}
            alt="Logo for The University of Utah"
            width={300}
            height={200}
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            src={logoVdl}
            alt="Logo for Visualization Design Lab"
            width={300}
            height={200}
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            alt="Logo for the National Science Foundation"
            src={logoNsf}
            width={200}
            height={200}
          />
        </div>
      </div>
      <span>
        Copyright ©{new Date().getFullYear()}{' '}
        {
          <a href="https://github.com/Trrack" target="_blank" rel="noreferrer">
            The Trrack Team
          </a>
        }
        . All content on this website is licensed under the Creative Commons
        Attribution license (CC BY).
      </span>
    </div>
  );
}
